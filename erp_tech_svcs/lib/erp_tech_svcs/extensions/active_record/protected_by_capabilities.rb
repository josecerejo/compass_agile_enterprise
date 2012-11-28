module ErpTechSvcs
	module Extensions
		module ActiveRecord
			module ProtectedByCapabilities

				def self.included(base)
					base.extend(ClassMethods)
				end

				module ClassMethods

				  def protected_by_capabilities
				    extend ProtectedByCapabilities::SingletonMethods
    				include ProtectedByCapabilities::InstanceMethods
    				
            has_many :capabilities, :as => :capability_resource

            # get records for this model without capabilities or that are not in a list of denied roles
            scope :with_security, lambda{|denied_roles|
                                    joins("LEFT OUTER JOIN capable_models AS cm ON cm.capable_model_record_id = #{self.table_name}.id AND cm.capable_model_record_type = '#{self.name}'").
                                    joins("LEFT JOIN capabilities_capable_models AS ccm ON ccm.capable_model_id = cm.id").
                                    joins("LEFT JOIN capabilities AS c ON ccm.capability_id = c.id").
                                    joins("LEFT JOIN secured_models AS sm ON sm.secured_record_id = c.id AND sm.secured_record_type = 'Capability'").
                                    joins("LEFT JOIN roles_secured_models AS rsm ON rsm.secured_model_id = sm.id").
                                    joins("LEFT JOIN roles AS r ON r.id = rsm.role_id").
                                    where("r.id IS NULL OR r.id NOT IN (?)", denied_roles.collect{|r| r.id }).
                                    group(columns.collect{|c| "#{self.table_name}.#{c.name}" })
                                  }

            # get records for this model that the given user has access to
            scope :with_user_security, lambda{|user| with_security(capability_roles - user.all_roles) }
				  end

				end
				
				module SingletonMethods

          # class method to get all capabilities for this model
          def capabilities
            Capability.where('capability_resource_type = ?', get_superclass(self.name))
          end

          # collect unique roles on capabilities
          def capability_roles
            capabilities.collect{|c| c.roles }.flatten.uniq
          end

          # add a class level capability, capability_resource_id will be NULL
          # the purpose of this is primarily for actions like create where the record does not exist yet
          # this will allow us to assign the create capability to a User or Role so that we can ask the question "can a user create a record for this model?"
          def add_capability(capability_type_iid)
            capability_type = convert_capability_type(capability_type_iid)
            scope_type = ScopeType.find_by_internal_identifier('class')
            Capability.find_or_create_by_capability_resource_type_and_capability_type_id_and_scope_type_id(get_superclass(self.name), capability_type.id, scope_type.id)
          end   

          def get_capability(capability_type_iid)
            capability_type = convert_capability_type(capability_type_iid)
            scope_type = ScopeType.find_by_internal_identifier('class')
            capabilities.where(:capability_resource_type => get_superclass(self.name), :capability_type_id => capability_type.id, :scope_type_id => scope_type.id).first
          end

          # remove a class level capability
          def remove_capability(capability_type_iid)
            capability = get_capability(capability_type_iid)
            capability.destroy unless capability.nil?
          end

          def convert_capability_type(type)
            CapabilityType.find_or_create_by_internal_identifier(type.to_s) if (type.is_a?(String) || type.is_a?(Symbol))
          end

				end
						
				module InstanceMethods

          def add_capability(capability_type_iid)
            capability_type = convert_capability_type(capability_type_iid)
            scope_type = ScopeType.find_by_internal_identifier('instance')
            capability = Capability.find_or_create_by_capability_resource_type_and_capability_resource_id_and_capability_type_id_and_scope_type_id(get_superclass, self.id, capability_type.id, scope_type.id)
            self.reload
            capability
          end   

          def get_capability(capability_type_iid)
            capability_type = convert_capability_type(capability_type_iid)
            capabilities.where(:capability_type_id => capability_type.id).first
          end   

          def remove_capability(capability_type_iid)
            capability = get_capability(capability_type_iid)
            capability.destroy unless capability.nil?
            self.reload
            capability
          end

				  def protected_by_capabilities?
            !capabilities.empty?
          end

          # def capabilites_to_hash
          #   self.capabilities.map do|capability| 
          #     {
          #       :capability_type_iid => capability.type.internal_identifier,
          #       :resource => capability.resource,
          #       :roles => capability.roles.collect{|role| role.internal_identifier}
          #     }
          #   end
          # end

          private

          def convert_capability_type(type)
            CapabilityType.find_or_create_by_internal_identifier(type.to_s) if (type.is_a?(String) || type.is_a?(Symbol))
          end

				end
			end
		end
	end
end