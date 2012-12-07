module ErpTechSvcs
  module Utils
    module CompassAccessNegotiator

      # pass in (capability_type_iid, class name) or (capability_type_iid, any class instance)
      # Example: can user upload files? user.has_capability?('upload', 'FileAsset')
      # Example: can download this file? user.has_capability?('download', file_asset)
      def has_capability?(capability_type_iid, klass)
        capability_type_iid = capability_type_iid.to_s if capability_type_iid.is_a?(Symbol)
        if klass.is_a?(String)
          scope_type = ScopeType.find_by_internal_identifier('class')
          capability = Capability.joins(:capability_type).
                                  where(:capability_resource_type => klass).
                                  where(:scope_type_id => scope_type.id).
                                  where(:capability_types => {:internal_identifier => capability_type_iid}).first
        else
          scope_type = ScopeType.find_by_internal_identifier('instance')
          capability = klass.capabilities.joins(:capability_type).
                              where(:scope_type_id => scope_type.id).
                              where(:capability_types => {:internal_identifier => capability_type_iid}).first
          return true if capability.nil? # object is not secured, so return true
        end
        result = all_capabilities.find{|c| c == capability }
        result.nil? ? false : true
      end

      # pass in (capability_type_iid, class name or any class instance, a block of code)
      # Example: do something if user can download this file: 
      # user.with_capability('download', file_asset) do
      #   something
      # end
      def with_capability(capability_type_iid, klass_instance, &block)
        if self.has_capability?(capability_type_iid, klass_instance)
          yield
        else
          raise ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability
        end
      end

      module Errors
        class CapabilityDoesNotExist < StandardError 
          def to_s
            "Capability does not exist."
          end
        end

        class CapabilityTypeDoesNotExist < StandardError
          def to_s
            "Capability type does not exist."
          end
        end

        class CapabilityAlreadytExists < StandardError
          def to_s
            "Capability already exists."
          end
        end

        class UserDoesNotHaveCapability < StandardError
          def to_s
            "User does not have capability."
          end
        end
      end
      
    end#CompassAccessNegotiator
  end#Utils
end#ErpTechSvcs
