module ErpTechSvcs
	module Extensions
		module ActiveRecord
			module HasCapabilities

				def self.included(base)
					base.extend(ClassMethods)  	        	      	
				end

				module ClassMethods

				  def has_capabilities
				    extend HasCapabilities::SingletonMethods
    				include HasCapabilities::InstanceMethods
    				
    				after_initialize :initialize_capable_model
    				after_update     :save_capable_model
    				after_create     :save_capable_model
    				after_destroy    :destroy_capable_model    

            has_one :capable_model, :as => :capable_model_record				
            has_many :capabilities, :through => :capable_model

            default_scope :include => :capabilities
				  end

          # class method to get all capabilities for this model
          def capabilities
            Capability.joins(:capable_models).where('capable_model_record_type = ?', self.name)
          end

          # get records for this model without capabilities or that are not in a list of denied roles
          def secure_scope(denied_roles=[])
            joins("LEFT OUTER JOIN capable_models ON capable_models.capable_model_record_id = file_assets.id AND capable_models.capable_model_record_type = '#{self.name}'").
            joins("LEFT JOIN capabilities_capable_models ON capabilities_capable_models.capable_model_id = capable_models.id").
            joins("LEFT JOIN capabilities ON capabilities_capable_models.capability_id = capabilities.id").
            joins("LEFT JOIN secured_models ON secured_models.secured_record_id = capabilities.id AND secured_models.secured_record_type = 'Capability'").
            joins("LEFT JOIN roles_secured_models ON roles_secured_models.secured_model_id = secured_models.id").
            joins("LEFT JOIN roles ON roles.id = roles_secured_models.role_id").
            where("roles.id IS NULL OR roles.id NOT IN (?)", denied_roles.collect{|r| r.id }).
            group(columns.collect{|c| "#{self.table_name}.#{c.name}" })
          end

          # get records for this model that the given user has access to
          def user_secure_scope(current_user=nil)
            all_roles = FileAsset.capabilities.collect{|c| c.roles }.first.uniq
            secure_scope(all_roles - current_user.roles)
          end
				end
				
				module SingletonMethods			
				end
						
				module InstanceMethods

				  def has_capabilities?
            !capabilities.empty?
          end

          def available_capability_resources
            capabilities.collect{|capability| capability.resource}.uniq
          end

          def capabilites_by_resource(resource)
            self.capabilities.where('resource = ?', resource)
          end

          def user_has_capability?(capability_type, resource, user)
            capability_type = convert_capability_type(capability_type)
            raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityTypeDoesNotExist if capability_type.nil?

            capability = find_capability(capability_type, resource)
            unless capability.nil?
              capability.has_access?(user)
            else
              raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityDoesNotExist
            end
          end

          def add_capability(capability_type, resource, *roles)
            capability_type = convert_capability_type(capability_type)
            raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityTypeDoesNotExist if capability_type.nil?
            
            capability = find_capability(capability_type, resource)
            if capability.nil?
              capability = Capability.create(:capability_type => capability_type, :resource => resource)
              capability.add_roles(roles)
              self.capable_model.capabilities << capability
              self.capable_model.save
            else
              raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityAlreadytExists
            end

            capability
          end

          def update_capability(capability_type, resource, *roles)
            capability_type = convert_capability_type(capability_type)
            raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityTypeDoesNotExist if capability_type.nil?

            capability = find_capability(capability_type, resource)
            unless capability.nil?
              capability.remove_all_roles
              capability.add_roles(roles)
            else
              raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityDoesNotExist
            end
          end

          def remove_all_capabilities
            self.capabilities.each do |capability|
              capability.destroy
            end
          end

          def remove_capability(capability_type, resource)
            capability_type = convert_capability_type(capability_type)
            raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityTypeDoesNotExist if capability_type.nil?

            capability = find_capability(capability_type, resource)
            unless capability.nil?
              capability.destroy
            else
              raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::CapabilityDoesNotExist
            end
          end

          def capabilites_to_hash
            self.capabilities.map do|capability| 
              {
                :capability_type_iid => capability.type.internal_identifier,
                :resource => capability.resource,
                :roles => capability.roles.collect{|role| role.internal_identifier}
              }
            end
          end

          def initialize_capable_model
            # added new_record? because simply querying for a file_asset was causing a plethora of unnecessary queries for capable_model
            if self.new_record? and self.capable_model.nil?
              capable_model = CapableModel.new
              self.capable_model = capable_model
              capable_model.capable_model_record = self
            end
          end

				  def save_capable_model
  					capable_model.save
				  end
				  
				  def destroy_capable_model
					  if self.capable_model && !self.capable_model.frozen?
  					  self.capable_model.destroy
  					end
				  end

          private

          def convert_capability_type(type)
            CapabilityType.find_by_internal_identifier(type.to_s) if (type.is_a?(String) || type.is_a?(Symbol))
          end

          def find_capability(capability_type, resource)
            if resource.nil?
              self.capabilities.where('capability_type_id = ? and resource is null', capability_type.id).first
            else
              self.capabilities.where('capability_type_id = ? and resource = ?', capability_type.id, resource).first
            end
          end

				end
			end
		end
	end
end