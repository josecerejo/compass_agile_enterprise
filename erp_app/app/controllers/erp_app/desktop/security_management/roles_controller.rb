module ErpApp
  module Desktop
    module SecurityManagement
      class RolesController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Security Role Name", :name => 'description', :xtype => 'textfield', :width => 200 })
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Internal ID", :name => 'internal_identifier', :xtype => 'textfield', :width => 195 })

            definition = []
            definition << DynamicFormField.textfield({ :fieldLabel => "Security Role Name", :name => 'description' })
            definition << DynamicFormField.textfield({ :fieldLabel => "Internal ID", :name => 'internal_identifier' })
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

          ar = assign_to_id.blank? ? SecurityRole : assign_to.constantize.find(assign_to_id).roles_not
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(security_roles.description) LIKE UPPER('%#{query_filter}%')"))
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map{|x| {:description => x.description, :internal_identifier => x.internal_identifier, :id => x.id}}}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort  = (params[:sort] || 'description').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? SecurityRole : assign_to.constantize.find(assign_to_id).roles
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(security_roles.description) LIKE UPPER('%#{query_filter}%')"))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map{|x| {:description => x.description, :internal_identifier => x.internal_identifier, :id => x.id}}}
        end

        def create
          begin
            description = params[:description].strip
            iid = params[:internal_identifier].strip

            unless description.blank?
              SecurityRole.create(:description => description, :internal_identifier => iid)
              render :json => {:success => true, :message => 'Security Role created'}
            else
              raise "Role name blank"
            end
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
              :success => false,
              :message => e.message
            }.to_json             
          end
        end

        def delete
          begin
            unless params[:id].blank?
              SecurityRole.destroy(params[:id])
              render :json => {:success => true, :message => 'Security Role deleted'}
            else
              raise "No Role ID"
            end
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :inline => {
              :success => false,
              :message => e.message
            }.to_json             
          end
        end

        def add
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |r|
              role = SecurityRole.find(r)
              case assign_to
              when 'User'
                a.add_role(role)
              when 'Group'
                a.add_role(role)
              when 'Capability'
                role.add_capability(a)
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
            selected.each do |r|
              role = SecurityRole.find(r)
              case assign_to
              when 'User'
                a.remove_role(role)
              when 'Group'
                a.remove_role(role)
              when 'Capability'
                role.remove_capability(a)
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
