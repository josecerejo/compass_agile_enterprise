module ErpApp
  module Desktop
    module SecurityManagement
      class UsersController < ErpApp::Desktop::SecurityManagement::BaseController

        def available_setup
          begin
            columns = []
            columns << DynamicGridColumn.build_column({ :fieldLabel => "First Name", :name => 'first_name', :xtype => 'textfield', :width => 100 })
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Last Name", :name => 'last_name', :xtype => 'textfield', :width => 100 })
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Username", :name => 'username', :xtype => 'textfield', :width => 95 })
            columns << DynamicGridColumn.build_column({ :fieldLabel => "Email", :name => 'email', :xtype => 'textfield', :width => 100 })

            definition = []
            definition << DynamicFormField.textfield({ :fieldLabel => "First Name", :name => 'first_name' })
            definition << DynamicFormField.textfield({ :fieldLabel => "Last Name", :name => 'last_name' })
            definition << DynamicFormField.textfield({ :fieldLabel => "Username", :name => 'username' })
            definition << DynamicFormField.textfield({ :fieldLabel => "Email", :name => 'email' })
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
          sort  = (params[:sort] || 'username').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? User : assign_to.constantize.find(assign_to_id).users_not
          ar = params[:query_filter].blank? ? ar : ar.where("UPPER(username) LIKE UPPER('%#{query_filter}%') OR UPPER(email) LIKE UPPER('%#{query_filter}%') ")
          available = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => available.map{|x| {:username => x.username, :email => x.email, :first_name => x.party.business_party.current_first_name, :last_name => x.party.business_party.current_last_name, :id => x.id}}}
        end

        def selected
          assign_to = params[:assign_to]
          assign_to_id = params[:id]
          sort  = (params[:sort] || 'username').downcase
          dir   = (params[:dir] || 'asc').downcase
          query_filter = params[:query_filter].strip rescue nil

          ar = assign_to_id.blank? ? User : assign_to.constantize.find(assign_to_id).users
          ar = (params[:query_filter].blank? ? ar : ar.where("UPPER(username) LIKE UPPER('%#{query_filter}%') OR UPPER(email) LIKE UPPER('%#{query_filter}%') "))
          selected = ar.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")

          render :json => {:total => ar.count, :data => selected.map{|x| {:username => x.username, :email => x.email, :first_name => x.party.business_party.current_first_name, :last_name => x.party.business_party.current_last_name, :id => x.id}}}
        end

        def add
          begin
            assign_to = params[:assign_to]
            assign_to_id = params[:id]
            selected = JSON.parse(params[:selection])

            a = assign_to.constantize.find(assign_to_id)
            selected.each do |x|
              u = User.find(x)
              case assign_to
              when 'Group'
                a.add_user(u)
              when 'SecurityRole'
                u.add_role(a)
              when 'Capability'
                u.add_capability(a)
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
            selected.each do |x|
              u = User.find(x)
              case assign_to
              when 'Group'
                a.remove_user(u)
              when 'SecurityRole'
                u.remove_role(a)
              when 'Capability'
                u.remove_capability(a)
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
        
        def effective_security
          begin
            assign_to_id = params[:id]
            u = User.find(assign_to_id)

            render :json => {:success => true, :roles => u.all_roles, :capabilities => u.class_capabilities_to_hash }
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
