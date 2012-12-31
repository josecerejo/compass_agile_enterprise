module ErpForms::ErpApp::Desktop::DynamicForms
  class DataController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController
    before_filter :set_file_support

    # setup dynamic data grid
    def setup
      begin
        form = DynamicForm.get_form(params[:model_name]) 
        raise "No Default Form found for this model." if form.nil?   
        definition = form.definition_object

        columns = []
        definition.each do |field_hash|
          if field_hash[:display_in_grid]
            # for some reason grid column widths are greater than form field widths
            field_hash[:width] = (field_hash[:width].to_f * 0.56).round.to_i unless field_hash[:width].nil?
            columns << DynamicGridColumn.build_column(field_hash)
          end
        end

        columns << DynamicGridColumn.build_column({ :fieldLabel => "Created By", :name => 'created_username', :xtype => 'textfield', :width => 100 })
        columns << DynamicGridColumn.build_column({ :fieldLabel => "Created At", :name => 'created_at', :xtype => 'datefield', :width => 115 })
        columns << DynamicGridColumn.build_column({ :fieldLabel => "Updated By", :name => 'updated_username', :xtype => 'textfield', :width => 100 })
        columns << DynamicGridColumn.build_column({ :fieldLabel => "Updated At", :name => 'updated_at', :xtype => 'datefield', :width => 115 })

        definition << DynamicFormField.textfield({ :fieldLabel => "Created By", :name => 'created_username' })
        definition << DynamicFormField.datefield({ :fieldLabel => "Created At", :name => 'created_at' })
        definition << DynamicFormField.textfield({ :fieldLabel => "Updated By", :name => 'updated_username' })
        definition << DynamicFormField.datefield({ :fieldLabel => "Updated At", :name => 'updated_at' })
        definition << DynamicFormField.hiddenfield({ :fieldLabel => "ID", :name => 'id' })
        definition << DynamicFormField.hiddenfield({ :fieldLabel => "Form ID", :name => 'form_id' })
        definition << DynamicFormField.hiddenfield({ :fieldLabel => "Model Name", :name => 'model_name' })

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

    # get dynamic data records
    def index
      begin
        sort  = (params[:sort] || 'created_at').downcase
        dir   = (params[:dir] || 'desc').downcase
        query_filter = params[:query_filter].strip rescue nil

        myDynamicObject = DynamicFormModel.get_constant(params[:model_name])

        if $USE_SOLR_FOR_DYNAMIC_FORM_MODELS and myDynamicObject.is_searchable?
          solr_search_results = myDynamicObject.search do
            keywords query_filter unless params[:query_filter].blank?
            paginate(:page => page, :per_page => per_page)
            order_by(sort.to_sym, dir.to_sym)
          end
          dynamic_records = solr_search_results.results
        else     
          dynamic_records = myDynamicObject.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")
          dynamic_records = dynamic_records.joins(:dynamic_data).where("UPPER(dynamic_data.dynamic_attributes) LIKE UPPER('%#{query_filter}%')") unless params[:query_filter].blank?
        end

        related_fields = dynamic_records.first.form.related_fields rescue []

        wi = []
        dynamic_records.each do |i|
          wihash = i.data.dynamic_attributes_with_related_data(related_fields, false)
          wihash[:id] = i.id
          wihash[:created_username] = i.data.created_by.nil? ? '' : i.data.created_by.username
          wihash[:updated_username] = i.data.updated_by.nil? ? '' : i.data.updated_by.username
          wihash[:created_at] = i.data.created_at.getlocal.strftime(@@datetime_format)
          wihash[:updated_at] = i.data.updated_at.getlocal.strftime(@@datetime_format)
          wihash[:form_id] = (i.data.updated_with_form_id ? i.data.updated_with_form_id : i.data.created_with_form_id)
          wihash[:model_name] = params[:model_name]
          wi << wihash
        end

        render :inline => "{ total:#{dynamic_records.total_entries}, data:#{wi.to_json} }"
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        render :inline => {
          :success => false,
          :message => e.message
        }.to_json             
      end
    end

    # get a single record with sorted_dynamic_attributes
    def get
      @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])

      data = @record.data.sorted_dynamic_attributes
      result_hash = {:success => true, :data => data, :metadata => get_metadata, :comments => get_comments, :has_file_assets => has_file_assets?}

      render :json => (@record ? result_hash : {:success => false})
    end

    # get a single record with dynamic_attributes_with_related_data
    def get_with_related_data
      @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])

      related_fields = @record.form.related_fields
      data = @record.data.dynamic_attributes_with_related_data(related_fields, true)
      result_hash = {:success => true, :data => data, :metadata => get_metadata, :comments => get_comments, :has_file_assets => has_file_assets?}

      render :json => (@record ? result_hash : {:success => false})
    end

    # create a dynamic data record
    def create
      begin
        check_file_upload_size

        form_data = JSON.parse(params[:form_data_json])
        form_data[:dynamic_form_id] = params[:dynamic_form_id]
        form_data[:model_name] = params[:model_name]
        form_data.symbolize_keys!

        @record = DynamicFormModel.get_instance(params[:model_name])

        form_data[:created_by] = current_user unless current_user.nil?
        form_data[:created_with_form_id] = params[:dynamic_form_id] if params[:dynamic_form_id]
        @record = @record.save_all_attributes(form_data, ErpForms::ErpApp::Desktop::DynamicForms::BaseController::IGNORED_PARAMS)
        is_secure = (@record.file_security_default == 'private')
        save_file_asset(form_data, is_secure) unless params[:file].nil?

        data = @record.data.sorted_dynamic_attributes
        result_hash = {
          :success => true, 
          :id => @record.id, 
          :model_name => params[:model_name], 
          :form_id => form_data[:created_with_form_id], 
          :data => data, 
          :metadata => get_metadata, 
          :comments => get_comments, 
          :has_file_assets => has_file_assets?
        }
        render :inline => @record ? result_hash.to_json : {:success => false}.to_json
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        render :inline => {
          :success => false,
          :message => e.message
        }.to_json             
      end
    end

    # update a dynamic data record
    def update
      begin
        check_file_upload_size

        form_data = JSON.parse(params[:form_data_json])
        form_data[:dynamic_form_id] = params[:dynamic_form_id]
        form_data[:model_name] = params[:model_name]
        form_data.symbolize_keys!

        @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])

        form_data[:updated_by] = current_user unless current_user.nil?
        form_data[:updated_with_form_id] = params[:dynamic_form_id] if params[:dynamic_form_id]      
        @record = @record.save_all_attributes(form_data, ErpForms::ErpApp::Desktop::DynamicForms::BaseController::IGNORED_PARAMS)
        save_file_asset(form_data, nil) unless params[:file].nil?

        data = @record.data.sorted_dynamic_attributes
        result_hash = {
          :success => true, 
          :id => params[:id], 
          :model_name => params[:model_name], 
          :form_id => form_data[:updated_with_form_id], 
          :data => data, 
          :metadata => get_metadata, 
          :comments => get_comments, 
          :has_file_assets => has_file_assets?
        }
        render :inline => @record ? result_hash.to_json : {:success => false}.to_json
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        render :inline => {
          :success => false,
          :message => e.message
        }.to_json             
      end
    end

    # delete a dynamic data record
    def delete
      begin
        @record = DynamicFormModel.get_constant(params[:model_name])
        @record.destroy(params[:id])
        render :json => {:success => true}
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        render :inline => {
          :success => false,
          :message => e.message
        }.to_json             
      end
    end

    # file tree
    def get_files
      @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])
      if @record.nil?
        render :json => []
      else
        set_root_node(params)
        render :json => @file_support.build_tree(base_path, :file_asset_holder => @record, :preload => true)
      end
    end

    # for plupload via filetree
    def upload_file
      result = {}
      upload_path = params[:directory]
      name = params[:name]
      data = request.raw_post

      begin
        @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])
        set_root_node(params)
        file = @record.add_file(data, File.join(@file_support.root,base_path,name))

        is_secure = (@record.file_security_default == 'private')
        set_file_security(file, is_secure)

        result = {:success => true}
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        result = {:success => false, :error => "Error uploading file. #{e.message}"}
      end

      render :inline => result.to_json
    end

    # toggle security on file
    def update_file_security
      begin
        path   = params[:path]
        secure = params[:secure]
        
        @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])
        file = @record.files.find(:first, :conditions => ['name = ? and directory = ?', ::File.basename(path), ::File.dirname(path)])

        set_file_security(file, (secure == 'true'))

        render :json =>  {:success => true}
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace.join("\n")
        render :inline => {
          :success => false,
          :message => e.message
        }.to_json             
      end
    end

    # file tree
    def delete_file
      messages = []

      nodes_to_delete = (params[:selected_nodes] ? JSON(params[:selected_nodes]) : [params[:node]])

      begin
        @record = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])
        result = false
        nodes_to_delete.each do |path|
          path = "#{path}/" if params[:leaf] == 'false' and path.match(/\/$/).nil?                
          begin
            name = File.basename(path)
            result, message, is_folder = @file_support.delete_file(File.join(@file_support.root,path))
            if result and !is_folder
              file = @record.files.find(:first, :conditions => ['name = ? and directory = ?', ::File.basename(path), ::File.dirname(path)])
              file.destroy
            end
            messages << message
          rescue Exception => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render :json => {:success => false, :error => "Error deleting #{name}"} and return
          end
        end # end nodes_to_delete.each
        if result
          render :json => {:success => true, :message => messages.join(',')}
        else
          render :json => {:success => false, :error => messages.join(',')}
        end
      rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
        render :json => {:success => false, :message => ex.message}
      end
    end

    protected
    def get_metadata
      metadata = {
        :created_username => (@record.data.created_by.nil? ? '' : @record.data.created_by.username),
        :updated_username => (@record.data.updated_by.nil? ? '' : @record.data.updated_by.username),
        :created_at => @record.data.created_at.getlocal.strftime(@@datetime_format),
        :updated_at => @record.data.updated_at.getlocal.strftime(@@datetime_format)
      }
    end

    def has_file_assets?
      @record.allow_files? and @record.respond_to?(:files)
    end

    def get_comments
      if @record.allow_comments? and @record.respond_to?(:comments)
        comments = @record.comments.order('id ASC').all
        comments.each_with_index do |c, i|
          comments[i] = c.to_hash
          comments[i][:created_at] = c.created_at.getlocal.strftime(@@datetime_format)
          comments[i][:updated_at] = c.updated_at.getlocal.strftime(@@datetime_format)
        end
      end
      comments
    end

    def check_file_upload_size
      unless params[:file].nil?
        if params[:file].tempfile.size > ErpTechSvcs::Config.max_file_size_in_mb.megabytes
          raise "File cannot be larger than #{ErpTechSvcs::Config.max_file_size_in_mb}MB"
        end
      end
    end

    def save_file_asset(form_data, is_secure)
      result = {}
      name = params[:file].original_filename
      data = params[:file].tempfile

      begin
        set_root_node(form_data)
        file = @record.add_file(data, File.join(@file_support.root, base_path, name))

        set_file_security(file, is_secure)

        return {:success => true}
      rescue Exception => e
        Rails.logger.error e.message
        Rails.logger.error e.backtrace
        raise "Error uploading file. #{e.message}"
      end
    end      

    def set_file_security(file, is_secure)
      unless is_secure.nil?
        is_secure = (is_secure == 'true' ? true : false) if is_secure.is_a?(String)

        if is_secure
          c = file.add_capability(:download)
          roles = ['admin', @record.role_iid]
          roles.each do |r|
            role = SecurityRole.find_by_internal_identifier(r)
            role.add_capability(c)
          end
        else
          file.remove_capability(:download)
        end

        # if we're using S3, set file permissions to private or public_read   
        @file_support.set_permissions(path, ((secure == 'true') ? :private : :public_read)) if ErpTechSvcs::Config.file_storage == :s3
      end
    end

    def set_root_node(form_data)
      @root_node = File.join(ErpTechSvcs::Config.file_assets_location, form_data[:model_name], @record.id.to_s)
    end

    def base_path          
      @base_path = (@root_node.nil? ? nil : File.join(@file_support.root, @root_node))
    end

    def set_file_support
      @file_support = ErpTechSvcs::FileSupport::Base.new(:storage => ErpTechSvcs::Config.file_storage)
    end        
  end
end
