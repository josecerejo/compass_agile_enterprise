module ErpApp
  module Desktop
    module SecurityManagement
      class CapabilitiesController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Description", :name => 'description', :xtype => 'textfield', :width => 395 })

            definition = []
            definition << DynamicFormField.textfield({ :fieldLabel => "Description", :name => 'description' })
            definition << DynamicFormField.hidden({ :fieldLabel => "ID", :name => 'id' })

            render :inline => "{
              \"success\": true,
              \"columns\": [#{columns.join(',')}],
              \"fields\": #{definition.to_json}
            }"
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
              :success => false,
              :message => e.message
            }.to_json             
          end
        end

        def selected_setup
          available_setup
        end
        
        def available
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort  = (params[:sort] || 'description').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          scope_type_ids = [ScopeType.find_by_internal_identifier('class').id, ScopeType.find_by_internal_identifier('query').id]

          ar = assign_to_id.blank? ? Capability.joins(:capability_type) : assign_to.constantize.find(assign_to_id).capabilities_not.where("scope_type_id IN (#{scope_type_ids.join(',')})")
          ar = (params[:query_filter].blank? ? ar : ar.where("(UPPER(capabilities.description) LIKE UPPER('%#{query_filter}%'))"))
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map{|x| {:description => x.description, :id => x.id}}}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort  = (params[:sort] || 'description').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          scope_type_ids = [ScopeType.find_by_internal_identifier('class').id, ScopeType.find_by_internal_identifier('query').id]

          ar = assign_to_id.blank? ? Capability.joins(:capability_type) : assign_to.constantize.find(assign_to_id).capabilities.where("scope_type_id IN (#{scope_type_ids.join(',')})")
          ar = (params[:query_filter].blank? ? ar : ar.where("(UPPER(capabilities.description) LIKE UPPER('%#{query_filter}%'))"))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map{|x| {:total => ar.count, :description => x.description, :id => x.id}}}
        end

        def add
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |c|
              capability = Capability.find(c)
              case assign_to
              when 'User'
                a.add_capability(capability)
              when 'SecurityRole'
                a.add_capability(capability)
              when 'Group'
                a.add_capability(capability)
              end
            end

            render :json => {:success => true, :message => 'Security Roles(s) Added'}
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
              :success => false,
              :message => e.message
            }.to_json             
          end
        end

        def remove
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |c|
              capability = Capability.find(c)
              case assign_to
              when 'User'
                a.remove_capability(capability)
              when 'SecurityRole'
                a.remove_capability(capability)
              when 'Group'
                a.remove_capability(capability)
              end
            end

            render :json => {:success => true, :message => 'Security Roles(s) Removed'}
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
              :success => false,
              :message => e.message
            }.to_json             
          end
        end
        
      end
    end
  end
end
