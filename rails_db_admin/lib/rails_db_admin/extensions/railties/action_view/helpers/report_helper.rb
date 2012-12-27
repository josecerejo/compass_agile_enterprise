module RailsDbAdmin
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module ReportHelper

            def render_report(report_iid)
              RailsDbAdmin::ReportSupport.new.render_report(report_iid)
            end

            def get_report_data(report_iid)
              RailsDbAdmin::ReportSupport.new.get_report_data(report_iid)
            end

            def report_download_url(report_iid, format)
              raw "/reports/display/#{report_iid}.#{format}"
            end

            def report_download_link(report_iid, format, display=nil)
              display = display || "Download #{format.to_s.humanize}"
              raw "<a target='_blank' href='#{report_download_url(report_iid, format)}'>#{display}</a>"
            end

          end #ReportHelper
        end #Helpers
      end #ActionView
    end #Railties
  end #Extensions
end #RailsDbAdmin