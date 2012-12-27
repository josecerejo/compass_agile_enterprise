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
          dir  = sort_hash[:direction] || 'DESC'
          limit = params[:limit] || 15
          start = params[:start] || 0

          if start_date.blank? and end_date.blank? and audit_log_type_id.blank?
            audit_log_entries = AuditLog.order("#{sort} #{dir}").offset(start).limit(limit).all
            total_count = AuditLog.count
          else
            audit_logs = AuditLog.arel_table

            arel_query = AuditLog.where(:created_at => start_date..(end_date + 1.day))
            arel_query = arel_query.where(audit_logs[:audit_log_type_id].eq(audit_log_type_id)) if audit_log_type_id

            audit_log_entries = arel_query.order("#{sort} #{dir}").offset(start).limit(limit).all

            total_count = arel_query.count
          end

          render :json => {:total_count => total_count,
                           :audit_log_entries => audit_log_entries.collect{
                               |audit_log| audit_log.to_hash(:only => [:id, :description, :created_at],
                                 :additional_values => {:party_description => audit_log.party.description,
                                                        :audit_log_type => audit_log.audit_log_type.description})}}
        end

        def items
          render :json => {:total_count => AuditLog.find(params[:audit_log_id]).items.count,
                           :audit_log_items => AuditLog.find(params[:audit_log_id]).items.collect{
                               |audit_log_item| audit_log_item.to_hash(:only => [:id, :description, :created_at, :audit_log_id],
                                                             :additional_values => {:value => audit_log_item.audit_log_item_value,
                                                                                    :audit_log_item_type => audit_log_item.type.description})}}
        end


        def audit_log_types
          audit_log_types= AuditLogType.all
          render :json => {:audit_log_types => audit_log_types.collect{|type| type.to_hash(:only => [:id, :description, :internal_identifier])}}
        end

      end #BaseController
    end #AuditLogViewer
  end #Desktop
end #ErpApp
