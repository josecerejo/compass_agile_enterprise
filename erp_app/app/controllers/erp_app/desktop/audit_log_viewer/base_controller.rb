module ErpApp
  module Desktop
    module AuditLogViewer
      class BaseController < ::ErpApp::Desktop::BaseController

        def index
          start_date = params[:start_date].to_time
          end_date = params[:end_date].to_time
          audit_log_type_id = params[:audit_log_type_id]

          sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
          sort = sort_hash[:property] || 'id'
          dir  = sort_hash[:direction] || 'ASC'
          limit = params[:limit] || 15
          start = params[:start] || 0

          if start_date.blank? and end_date.blank? and audit_log_type_id.blank?
            audit_log_entries = AuditLog.order("#{sort} #{dir}").offset(start).limit(limit).all
            total_count = AuditLog.count
          else
            audit_logs = AuditLog.arel_table

            audit_log_entries = AuditLog.where(audit_logs[:created_at].gteq(start_date)
                                               .and(audit_logs[:created_at].lteq(end_date))
                                               .and(audit_logs[:audit_log_type_id].eq(audit_log_type_id)))
                                        .order("#{sort} #{dir}").offset(start).limit(limit).all
            total_count = AuditLog.where(audit_logs[:created_at].gteq(start_date)
                                         .and(audit_logs[:created_at].lteq(end_date))
                                         .and(audit_logs[:audit_log_type_id].eq(audit_log_type_id))).count
          end

          render :json => {:total_count => total_count,
                           :audit_log_entries => audit_log_entries.collect{
                               |audit_log| audit_log.to_hash(:only => [:id, :description, :created_at],
                                 :additional_values => {:party_description => audit_log.party.description,
                                                        :audit_log_type => audit_log.audit_log_type.description})}}
        end

        def items
          id=params[:id]

          page= (params[:page].to_i)
          if (page==0)
            page=1
          end
          row_count= params[:limit].to_i
          if (row_count==0)
            row_count=10
          end
          sort=params[:sort]
          if (sort!=nil)
            sort_hash = ActiveSupport::JSON.decode(sort)
            logger.debug("\n\nsort_hash :#{sort_hash[0].class}-#{sort_hash[0]}")
            property=sort_hash[0]['property']
            direction=sort_hash[0]['direction']
            logger.debug("\n\nsort :#{property} -#{direction}")
          end

          rec_count=AuditLogItem.count(:conditions => ["audit_log_id = ?", id])
          paged_results=AuditLogItem.paginate(:page => page, :per_page => row_count, :conditions => ["audit_log_id = ?", id])
          render :json => {:total_count => rec_count, :audit_items => paged_results}
        end


        def audit_log_types
          audit_log_types= AuditLogType.all
          render :json => {:audit_log_types => audit_log_types.collect{|type| type.to_hash(:only => [:id, :description, :internal_identifier])}}
        end

      end #BaseController
    end #AuditLogViewer
  end #Desktop
end #ErpApp
