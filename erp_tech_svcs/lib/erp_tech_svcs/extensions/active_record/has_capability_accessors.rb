module ErpTechSvcs
  module Extensions
    module ActiveRecord
      module HasCapabilityAccessors

        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods

          def has_capability_accessors
            extend HasCapabilityAccessors::SingletonMethods
            include HasCapabilityAccessors::InstanceMethods
            
            has_many :capability_accessors, :as => :capability_accessor_record
          end

        end
        
        module SingletonMethods
          
        end

        module InstanceMethods        

          # pass in (capability_type_iid, klass) or (capability) object
          def add_capability(*capability)
            capability = capability.first.is_a?(String) ? get_or_create_capability(capability.first, capability.second) : capability.first
            ca = CapabilityAccessor.find_or_create_by_capability_accessor_record_type_and_capability_accessor_record_id_and_capability_id(get_superclass, self.id, capability.id)
            self.reload
            ca
          end

          def get_or_create_capability(capability_type_iid, klass)
            capability_type = convert_capability_type(capability_type_iid)
            scope_type = ScopeType.find_by_internal_identifier('class')
            Capability.find_or_create_by_capability_resource_type_and_capability_type_id_and_scope_type_id(klass, capability_type.id, scope_type.id)
          end

          def get_capability(capability_type_iid, klass)
            capability_type = convert_capability_type(capability_type_iid)
            scope_type = ScopeType.find_by_internal_identifier('class')
            Capability.find_by_capability_resource_type_and_capability_type_id_and_scope_type_id(klass, capability_type.id, scope_type.id)
          end

          # pass in (capability_type_iid, klass) or (capability) object
          def remove_capability(*capability)
            capability = capability.first.is_a?(String) ? get_or_create_capability(capability.first, capability.second) : capability.first
            ca = capability_accessors.where(:capability_accessor_record_type => get_superclass, :capability_accessor_record_id => self.id, :capability_id => capability.id).first
            ca.destroy unless ca.nil?
            self.reload
            ca
          end

          def has_capabilities?
            !capability_accessors.empty?
          end

          private
          def convert_capability_type(type)
            CapabilityType.find_or_create_by_internal_identifier(type.to_s) if (type.is_a?(String) || type.is_a?(Symbol))
          end
        end
      end
    end
  end
end