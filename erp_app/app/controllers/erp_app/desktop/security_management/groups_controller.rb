module ErpApp
  module Desktop
    module SecurityManagement
      class GroupsController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Group Name", :name => 'description', :xtype => 'textfield', :width => 395 })

            definition = []
            definition << DynamicFormField.textfield({ :fieldLabel => "Group Name", :name => 'description' })
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

          ar = assign_to_id.blank? ? Group : assign_to.constantize.find(assign_to_id).groups_not
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(groups.description) LIKE UPPER('%#{query_filter}%')"))
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map{|x| {:description => x.description, :id => x.id}}}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort  = (params[:sort] || 'description').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? Group : assign_to.constantize.find(assign_to_id).groups
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(groups.description) LIKE UPPER('%#{query_filter}%')"))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map{|x| {:description => x.description, :id => x.id}}}
        end

        def create
          begin
            description = params[:description].strip

            unless description.blank?
              Group.create(:description => params[:description]) 
              render :json => {:success => true, :message => 'Group created'}
            else
              raise "Group name blank"
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
            selected.each do |g|
              group = Group.find(g)
              case assign_to
              when 'User'
                group.add_user(a)
              when 'SecurityRole'
                group.add_role(a)
              when 'Capability'
                group.add_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Added'}
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
            selected.each do |g|
              group = Group.find(g)
              case assign_to
              when 'User'
                group.remove_user(a)
              when 'SecurityRole'
                group.remove_role(a)
              when 'Capability'
                group.remove_capability(a)
              end
            end

            render :json => {:success => true, :message => 'Group(s) Removed'}
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
