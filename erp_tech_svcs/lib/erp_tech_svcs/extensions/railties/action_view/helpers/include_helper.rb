module ErpTechSvcs
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module IncludeHelper

            def set_max_file_upload
              raw "<script type='text/javascript'>Ext.ns('ErpTechSvcs.Config'); ErpTechSvcs.Config.max_file_size_in_mb = #{ErpTechSvcs::Config.max_file_size_in_mb};</script>"
            end

            def set_email_regex
              raw "<script type='text/javascript'>ErpTechSvcs.Config.email_regex = \"#{ErpTechSvcs::Config.email_regex}\";</script>"
            end
            
          end
        end
      end
    end
  end
end