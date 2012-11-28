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
            scope :with_instance_security, lambda{|denied_roles|
                                    joins("LEFT JOIN capabilities AS c ON c.capability_resource_id = #{self.table_name}.id AND c.capability_resource_type = '#{self.name}'").
                                    where("c.id IS NULL OR c.id NOT IN (?)", denied_roles.collect{|c| c.id }).
                                    group(columns.collect{|c| "#{self.table_name}.#{c.name}" })
                                  }

            # get records for this model that the given user has access to
            scope :with_user_security, lambda{|user| with_instance_security(capabilities - user.all_capabilities) }
				  end

				end
				
				module SingletonMethods
          # class method to get all capabilities for this model
          def capabilities
            Capability.where('capability_resource_type = ?', get_superclass(self.name))
          end

          # class method to get all capabilities for this model
          def all_capabilities
            capabilities
          end

          # class method to get only class capabilities for this model
          def class_capabilities
            scope_capabilities('class')
          end

          # class method to get only query capabilities for this model
          def query_capabilities
            scope_capabilities('query')
          end

          # class method to get only instance capabilities for this model
          def instance_capabilities
            scope_capabilities('instance')
          end

          def scope_capabilities(scope_type_iid)
            scope_type = ScopeType.find_by_internal_identifier(scope_type_iid)
            capabilities.where(:scope_type_id => scope_type.id)
          end

          # collect unique roles on capabilities
          def capability_roles
            capabilities.collect{|c| c.roles }.flatten.uniq
          end

          # add a class level capability (capability_resource_id will be NULL)
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