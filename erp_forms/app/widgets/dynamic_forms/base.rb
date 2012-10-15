module Widgets
  module DynamicForms
    class Base < ErpApp::Widgets::Base
      def index
	      render
	    end

  	  def new
        begin
          form_data = JSON.parse(params[:data]).symbolize_keys!
          @website = Website.find_by_host(request.host_with_port)

          if form_data[:email_subject].blank?
            subject = "#{form_data[:model_name]} Submission from #{@website.title}"
          else
            subject = strip_tags(form_data[:email_subject])
            form_data.delete(:email_subject)
          end

      		@myDynamicObject = DynamicFormModel.get_instance(form_data[:model_name])
  		
      		form_data[:created_by] = current_user unless current_user.nil?
      		form_data[:created_with_form_id] = form_data[:dynamic_form_id] if form_data[:dynamic_form_id] and form_data[:is_html_form].blank?
      		form_data[:website] = @website.title

      		@myDynamicObject = DynamicFormModel.assign_all_attributes(@myDynamicObject, form_data, ErpApp::Widgets::Base::IGNORED_PARAMS)
  			
          # get dynamic for from form_data[:created_with_form_id]
          form = DynamicForm.find(form_data[:created_with_form_id])
          
          # check widget_action from dynamic form
          if !form.nil? and ['email', 'both'].include?(form.widget_action)
            # email data
            send_email(form, @myDynamicObject, subject)
          end

          if form.nil? or (!form.nil? and ['save', 'both'].include?(form.widget_action))
            #save data
            @myDynamicObject.save
          end          

          render :json => {
            :success => true,
            :response => render_to_string(:template => "success", :layout => false) 
          }
        rescue Exception => e
          Rails.logger.info e.message
          Rails.logger.info e.backtrace.join("\n")
  			  render :json => {
  			    :success => false,
            :response => render_to_string(:template => "error", :layout => false) 
  			  }    			    
        end
  	  end

      protected
      def send_email(form, dynamicObject, subject='')
        begin
          DynamicFormMailer.widget_email(form, dynamicObject, subject).deliver
        rescue Exception => e
          system_user = Party.find_by_description('Compass AE')
          AuditLog.custom_application_log_message(system_user, e)
        end
      end


      #should not be modified
      #modify at your own risk
      def locate
        File.dirname(__FILE__)
      end
  
      class << self
        def title
          "Dynamic Forms"
        end
    
        def widget_name
          File.basename(File.dirname(__FILE__))
        end
    
        def base_layout
          begin
            file = File.join(File.dirname(__FILE__),"/views/layouts/base.html.erb")
            IO.read(file)
          rescue
            return nil
          end
        end
      end
    end
  end
end
