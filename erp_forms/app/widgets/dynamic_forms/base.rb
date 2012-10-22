module Widgets
  module DynamicForms
    class Base < ErpApp::Widgets::Base
      def index
	      render
	    end

  	  def new
        begin
          unless params[:file].nil?
            # size check
            if params[:file].tempfile.size > ErpTechSvcs::Config.max_file_size_in_mb.megabytes
              raise "File cannot be larger than #{ErpTechSvcs::Config.max_file_size_in_mb}MB"
            end
          end
          dyn_form_fields = JSON.parse(params[:dyn_form_fields])
          form_data = {}
          dyn_form_fields.each do |key|
            form_data[key] = params[key]
          end
          form_data[:dynamic_form_id] = params[:dynamic_form_id]
          form_data[:model_name] = params[:model_name]
          form_data.symbolize_keys!
          @website = Website.find_by_host(request.host_with_port)

          if form_data[:email_subject].blank?
            subject = "#{form_data[:model_name]} Submission from #{@website.title}"
          else
            subject = strip_tags(form_data[:email_subject])
            form_data.delete(:email_subject)
          end

      		@myDynamicObject = DynamicFormModel.get_instance(form_data[:model_name])

      		form_data[:created_by] = current_user unless current_user.nil?
      		form_data[:created_with_form_id] = form_data[:dynamic_form_id] if form_data[:dynamic_form_id] and params[:is_html_form].blank?
      		form_data[:website] = @website.title

      		@myDynamicObject = DynamicFormModel.assign_all_attributes(@myDynamicObject, form_data, ErpApp::Widgets::Base::IGNORED_PARAMS)
  			
          # get dynamic for from form_data[:created_with_form_id]
          form = DynamicForm.find(form_data[:created_with_form_id])
          
          # check widget_action from dynamic form
          if !form.nil? and ['email', 'both'].include?(form.widget_action)            
            # email data
            attachments = (params[:file].nil? ? [] : [params[:file]])
            send_email(form, @myDynamicObject, subject, attachments)
          end

          if form.nil? or (!form.nil? and ['save', 'both'].include?(form.widget_action))
            #save data
            @myDynamicObject.save
            save_file_asset(form_data) unless params[:file].nil?
          end

          render :inline => {
            :success => true,
            :response =>  ERB::Util.html_escape(render_to_string(:template => "success", :layout => false))
          }.to_json
        rescue Exception => e
          Rails.logger.error e.message
          Rails.logger.error e.backtrace.join("\n")
  			  render :inline => {
  			    :success => false,
            :response => ERB::Util.html_escape(render_to_string(:template => "error", :layout => false, :locals => {:message => e.message}))
  			  }.to_json    			    
        end
  	  end

      protected
      def save_file_asset(form_data)
        result = {}
        name = params[:file].original_filename
        data = params[:file].tempfile
        set_file_support

        # begin
          @root_node = File.join(ErpTechSvcs::Config.file_assets_location, form_data[:model_name], @myDynamicObject.id.to_s)
          @myDynamicObject.add_file(data, File.join(@file_support.root, base_path, name))
          return {:success => true}
        # rescue Exception => e
        #   Rails.logger.error e.message
        #   Rails.logger.error e.backtrace
        #   raise "Error uploading file. #{e.message}"
        # end
      end      

      def base_path          
        @base_path = (@root_node.nil? ? nil : File.join(@file_support.root, @root_node))
      end

      def set_file_support
        @file_support = ErpTechSvcs::FileSupport::Base.new(:storage => ErpTechSvcs::Config.file_storage)
      end

      def send_email(form, dynamicObject, subject='', attachments=[])
        # begin
            DynamicFormMailer.widget_email_with_attachments(form, dynamicObject, subject, attachments).deliver
        # rescue Exception => e
        #   Rails.logger.error e.message
        #   Rails.logger.error e.backtrace
        #   raise "Error sending email. #{e.message}"
        # end
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
