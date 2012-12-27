module RailsDbAdmin
  module Reports

    class BaseController < ::ErpApp::Desktop::BaseController

      def index
        report_iid = params[:iid]

        @report = Report.find_by_internal_identifier(report_iid)

        if @report.nil?
          render :no_report, :layout => false
        else
          respond_to do |format|
            format.html {
              render :show_report, :layout => false
            }

            format.csv {
              data = RailsDbAdmin::ReportSupport.new.render_report(report_iid, :csv)

              send_data(data, :filename => "#{@report.name}.csv", :type => "application/csv")
            }

            format.pdf {
              data = RailsDbAdmin::ReportSupport.new.render_report(report_iid, :pdf)

              send_data(data, :filename => "#{@report.name}.pdf", :type => "application/pdf")
            }
          end
        end


      end

    end #BaseController
  end #Reports
end #RailsDbAdmin