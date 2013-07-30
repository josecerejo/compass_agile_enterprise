module ErpTechSvcs
	module Extensions
		module ActiveRecord
			module ProtectedByCapabilities

				def self.included(base)
					base.extend(ClassMethods)
				end

				module ClassMethods

				  def protected_with_capabilities(options = {})
				    extend ProtectedByCapabilities::SingletonMethods
    				include ProtectedByCapabilities::InstanceMethods

            has_many :capabilities, :as => :capability_resource
    				
            # protect all instance of this class by default
            class_attribute :protect_all_instances
            self.protect_all_instances = (options[:protect_all_instances].nil? ? false : options[:protect_all_instances])

            # Get records filtered via query scope capabilities
            # By default Compass AE treats query scopes as restrictions
            # A user will see all records unless the user has a capability accessor with a query scope
            # If you set :protect_all_instances => true it is honored via with_user_security & with_instance_security but NOT with_query_security
            # arguments: user, capability_type_iids 
            # capability_type_iids is optional and can be a single string or an array of strings
            # Example: which files can this user download? FileAsset.with_query_security(user, 'download').all
            # Example: which website sections can this user either view or edit? WebsiteSection.with_query_security(user, ['view','edit']).all
            scope :with_query_security, lambda{|*args|
              raise ArgumentError if args.empty? || args.size > 2
              user = args.first
              capability_type_iids = args.second || []
              capability_type_iids = [capability_type_iids] if capability_type_iids.is_a?(String)

              scope_type = ScopeType.find_by_internal_identifier('query')
              granted_capabilities = user.all_capabilities.where(:scope_type_id => scope_type.id).where(:capability_resource_type => self.name)

              unless capability_type_iids.empty?
                capability_type_ids = capability_type_iids.collect{|type| convert_capability_type(type).id }
                granted_capabilities = granted_capabilities.where("capability_type_id IN (?)", capability_type_ids.join(','))
              end

              query = nil
              granted_capabilities.each do |scope_capability|
                query = query.nil? ? where(scope_capability.scope_query) : query.where(scope_capability.scope_query)
              end
              query
            }

            # Get records for this model permitted via instance capabilities
            # If :protect_all_instances => true return only instances user has explicitly been granted access to
            # If :protect_all_instances => false return instances without capabilities or that user is granted access to (default)
            # arguments: user, capability_type_iids 
            # capability_type_iids is optional and can be a single string or an array of strings
            # Example: which files can this user download? FileAsset.with_instance_security(user, 'download').all
            # Example: which website sections can this user either view or edit? WebsiteSection.with_instance_security(user, ['view','edit']).all
            scope :with_instance_security, lambda{|*args|
              raise ArgumentError if args.empty? || args.size > 2
              user = args.first
              capability_type_iids = args.second || []
              capability_type_iids = [capability_type_iids] if capability_type_iids.is_a?(String)

              scope_type = ScopeType.find_by_internal_identifier('instance')
              granted_capabilities = user.all_capabilities.where(:scope_type_id => scope_type.id).where(:capability_resource_type => self.name)

              unless capability_type_iids.empty?
                capability_type_ids = capability_type_iids.collect{|type| convert_capability_type(type).id }
                granted_capabilities = granted_capabilities.where("capability_type_id IN (#{capability_type_ids.join(',')})")
              end

              denied_capabilities = instance_capabilities.select('capabilities.id').where("capabilities.id NOT IN (#{granted_capabilities.select('capabilities.id').to_sql})")
              deny_count = denied_capabilities.count

              join_type = (self.protect_all_instances ? 'JOIN' : 'LEFT JOIN')
              query = joins("#{join_type} capabilities AS c ON c.capability_resource_id = #{self.table_name}.id AND c.capability_resource_type = '#{self.name}'").
                      group(columns.collect{|c| "#{self.table_name}.#{c.name}" })
              query = (deny_count == 0 ? query.where("c.id NOT IN (SELECT id FROM capabilities) OR c.id = c.id") : query.where("c.id NOT IN (SELECT id FROM capabilities) OR c.id NOT IN (#{denied_capabilities.to_sql})"))
              query
            }

            # Get records for this model that the given user has access to
            # arguments: user, capability_type_iids 
            # capability_type_iids is optional and can be a single string or an array of strings
            # Example: which files can this user download? FileAsset.with_user_security(user, 'download').all
            # Example: which website sections can this user either view or edit? WebsiteSection.with_user_security(user, ['view','edit']).all
            scope :with_user_security, lambda{|*args|
              raise ArgumentError if args.empty? || args.size > 2              
              with_instance_security(*args).with_query_security(*args)
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

          # return unique roles on capabilities for this model
          def capability_roles
            SecurityRole.joins(:capability_accessors => :capability).where(:capability_accessors => {:capabilities => {:capability_resource_type => get_superclass(self.name) }}).all.uniq
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

          # convenience method to access class method
          def protect_all_instances
            self.class.protect_all_instances
          end

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
            !get_capability(capability_type_iid).nil? or protect_all_instances
          end

          def allow_access?(user, capability_type_iid)
            if (!self.protect_all_instances and !self.protected_with_capability?(capability_type_iid.to_s)) or (user and user.has_capability?(capability_type_iid.to_s, self))
              return true
            else
              return false
            end
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