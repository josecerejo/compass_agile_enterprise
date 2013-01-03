module ErpTechSvcs
	module Extensions
		module ActiveRecord
			module ProtectedByCapabilities

				def self.included(base)
					base.extend(ClassMethods)
				end

				module ClassMethods

				  def protected_with_capabilities
				    extend ProtectedByCapabilities::SingletonMethods
    				include ProtectedByCapabilities::InstanceMethods
    				
            has_many :capabilities, :as => :capability_resource

            # get records filtered via query scope capabilities
            # by default Compass AE treats query scopes as restrictions
            # a user will see all records unless the user has a capability accessor with a query scope
            scope :with_query_security, lambda{|*args|
              raise ArgumentError if args.empty? || args.size > 2
              user = args.first
              capability_type_iids = args.second || []
              capability_type_iids = [capability_type_iids] if capability_type_iids.is_a?(String)

              scope_type = ScopeType.find_by_internal_identifier('query')
              granted_capabilities = user.all_capabilities.collect{|c| c if c.scope_type_id == scope_type.id and c.capability_resource_type == self.name }.compact

              unless capability_type_iids.empty?
                capability_type_ids = capability_type_iids.collect{|type| convert_capability_type(type).id }
                granted_capabilities = granted_capabilities.collect{|c| c if capability_type_ids.include?(c.capability_type_id)}.compact
              end

              query = nil
              granted_capabilities.each do |scope_capability|
                query = query.nil? ? where(scope_capability.scope_query) : query.where(scope_capability.scope_query)
              end
              query
            }

            # get records for this model without capabilities or that are not in a list of denied capabilities
            scope :with_instance_security, lambda{|denied_capabilities|
                                    query = joins("LEFT JOIN capabilities AS c ON c.capability_resource_id = #{self.table_name}.id AND c.capability_resource_type = '#{self.name}'").
                                            group(columns.collect{|c| "#{self.table_name}.#{c.name}" })
                                    query = (denied_capabilities.empty? ? query.where("c.id IS NULL OR c.id = c.id") : query.where("c.id IS NULL OR c.id NOT IN (?)", denied_capabilities.collect{|c| c.id }))
                                    query                                    
                                  }

            # get records for this model that the given user has access to
            # arguments: user, capability_type_iids 
            # capability_type_iids is optional and can be a single string or an array of strings
            # Example: which files can this user download? FileAsset.with_user_security(user, 'download').all
            # Example: which website sections can this user either view or edit? WebsiteSection.with_user_security(user, ['view','edit']).all
            scope :with_user_security, lambda{|*args|
              raise ArgumentError if args.empty? || args.size > 2
              user = args.first
              capability_type_iids = args.second || []
              capability_type_iids = [capability_type_iids] if capability_type_iids.is_a?(String)

              scope_type = ScopeType.find_by_internal_identifier('instance')
              granted_capabilities = user.all_capabilities.collect{|c| c if c.scope_type_id == scope_type.id and c.capability_resource_type == self.name }.compact

              unless capability_type_iids.empty?
                capability_type_ids = capability_type_iids.collect{|type| convert_capability_type(type).id }
                granted_capabilities = granted_capabilities.collect{|c| c if capability_type_ids.include?(c.capability_type_id)}.compact
              end
              
              with_query_security(*args).with_instance_security(instance_capabilities - granted_capabilities) 
            }
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

          def protect_with_capability(capability_type_iid)
            add_capability(capability_type_iid)
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

          def unprotect_with_capability(capability_type_iid)
            remove_capability(capability_type_iid)
          end

          def convert_capability_type(type)
            return type if type.is_a?(CapabilityType)
            return nil unless (type.is_a?(String) || type.is_a?(Symbol))
            ct = CapabilityType.find_by_internal_identifier(type.to_s)
            return ct unless ct.nil?
            CapabilityType.create(:internal_identifier => type.to_s, :description => type.to_s.titleize)
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

          def protect_with_capability(capability_type_iid)
            add_capability(capability_type_iid)
          end

          def get_capability(capability_type_iid)
            capability_type = convert_capability_type(capability_type_iid)
            capabilities.where(:capability_type_id => capability_type.id).first
          end   

          def protected_with_capability?(capability_type_iid)
            !get_capability(capability_type_iid).nil?
          end

          def remove_capability(capability_type_iid)
            capability = get_capability(capability_type_iid)
            capability.destroy unless capability.nil?
            self.reload
            capability
          end

          def unprotect_with_capability(capability_type_iid)
            remove_capability(capability_type_iid)
          end

				  def protected_with_capabilities?
            !capabilities.empty?
          end

          private
          def convert_capability_type(type)
            self.class.convert_capability_type(type)
          end

				end
			end
		end
	end
end