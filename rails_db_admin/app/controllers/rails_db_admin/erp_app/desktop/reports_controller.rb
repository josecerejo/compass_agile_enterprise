module RailsDbAdmin
  module ErpApp
    module Desktop
      class ReportsController < QueriesController

        def index
          reports = Report.all.collect{ |report|{:text => report.name, :id => report.id,
                                                 :uniqueName => report.internal_identifier,
                                                 :iconCls => 'icon-document', :leaf => true} }

          render :json => reports
        end

        def create
          name = params[:name]
          internal_identifier = params[:internal_identifier]

          report = Report.new(:name => name, :internal_identifier => internal_identifier)
          if report.save
            render :json => {:success => true}
          else
            render :json => {:success => false, :msg => 'Error creating report'}
          end
        end

        def edit
          id  = params[:id]

          report = Report.find(id)

          if report
            render :json => {:success => true, :report =>
                {:title => report.name, :id => report.id, :query => report.query,
                 :internalIdentifier => report.internal_identifier, :template => report.template}
            }
          else
            render :json => {:success => false}
          end
        end

        def save
          id  = params[:id]
          query = params[:query]
          template = params[:template]

          report = Report.find(id)

          report.query = query
          report.template = template

          if report.save
            render :json => {:success => true}
          else
            render :json => {:success => false}
          end
        end

        def delete
          id  = params[:id]

          if Report.find(id).destroy
            render :json => {:success => true}
          else
            render :json => {:success => false}
          end
        end

        def open_query
          query_name = params[:query_name]
          query = @query_support.get_query(query_name)

          render :json => {:success => true, :query => query}
        end

      end #QueriesController
    end #Desktop
  end #ErpApp
end #RailsDbAdmin
