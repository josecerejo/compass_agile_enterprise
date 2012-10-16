module ErpForms::ErpApp::Desktop::DynamicForms
  class DataController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController

    # setup dynamic data grid
    def setup
      form = DynamicForm.get_form(params[:model_name])    
      definition = form.definition_object

      columns = []
      definition.each do |field_hash|
        if field_hash[:display_in_grid]
          field_hash[:width] = (field_hash[:width].to_f * 0.56).round.to_i # for some reason grid column widths are greater than form field widths
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
      definition << DynamicFormField.hidden({ :fieldLabel => "ID", :name => 'id' })
      definition << DynamicFormField.hidden({ :fieldLabel => "Form ID", :name => 'form_id' })
      definition << DynamicFormField.hidden({ :fieldLabel => "Model Name", :name => 'model_name' })

      render :inline => "{
        \"success\": true,
        \"columns\": [#{columns.join(',')}],
        \"fields\": #{definition.to_json}
      }"
    end

    # get dynamic data records
    def index
      sort  = params[:sort] || 'created_at'
      dir   = params[:dir] || 'DESC'

      myDynamicObject = DynamicFormModel.get_constant(params[:model_name])
      
      dynamic_records = myDynamicObject.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")
      related_fields = dynamic_records.first.form.related_fields rescue []

      wi = []
      dynamic_records.each do |i|
        wihash = i.data.dynamic_attributes_with_related_data(related_fields, false)
        wihash[:id] = i.id
        wihash[:created_username] = i.data.created_by.nil? ? '' : i.data.created_by.username
        wihash[:updated_username] = i.data.updated_by.nil? ? '' : i.data.updated_by.username
        wihash[:created_at] = i.data.created_at.strftime(@@datetime_format)
        wihash[:updated_at] = i.data.updated_at.strftime(@@datetime_format)
        wihash[:form_id] = (i.data.updated_with_form_id ? i.data.updated_with_form_id : i.data.created_with_form_id)
        wihash[:model_name] = params[:model_name]
        wi << wihash
      end

      render :inline => "{ total:#{dynamic_records.total_entries}, data:#{wi.to_json} }"
    end

    def get
      myDynamicObject = DynamicFormModel.get_constant(params[:model_name])
      @record = myDynamicObject.find(params[:id])

      related_fields = @record.form.related_fields
      data = @record.data.dynamic_attributes_with_related_data(related_fields, true)

      metadata = {
        :created_username => (@record.data.created_by.nil? ? '' : @record.data.created_by.username),
        :updated_username => (@record.data.updated_by.nil? ? '' : @record.data.updated_by.username),
        :created_at => @record.data.created_at.getlocal.strftime(@@datetime_format),
        :updated_at => @record.data.updated_at.getlocal.strftime(@@datetime_format)
      }

      result_hash = {:success => true, :data => data, :metadata => metadata}

      if @record.respond_to?(:comments)
        result_hash[:comments] = @record.comments.order('id ASC').all
        result_hash[:comments].each_with_index do |c, i|
          result_hash[:comments][i] = c.to_hash
          result_hash[:comments][i][:created_at] = c.created_at.getlocal.strftime(@@datetime_format)
          result_hash[:comments][i][:updated_at] = c.updated_at.getlocal.strftime(@@datetime_format)
        end
      end

      render :json => @record ? result_hash : {:success => false}    
    end

    # create a dynamic data record
    def create
      @myDynamicObject = DynamicFormModel.get_instance(params[:model_name])

      params[:created_by] = current_user unless current_user.nil?
      params[:created_with_form_id] = params[:dynamic_form_id] if params[:dynamic_form_id]
      @myDynamicObject = DynamicFormModel.save_all_attributes(@myDynamicObject, params, ErpForms::ErpApp::Desktop::DynamicForms::BaseController::IGNORED_PARAMS)
      
      render :json => @myDynamicObject ? {:success => true} : {:success => false}
    end

    # update a dynamic data record
    def update
      @myDynamicObject = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])

      params[:updated_by] = current_user unless current_user.nil?
      params[:updated_with_form_id] = params[:dynamic_form_id] if params[:dynamic_form_id]      
      @myDynamicObject = DynamicFormModel.save_all_attributes(@myDynamicObject, params, ErpForms::ErpApp::Desktop::DynamicForms::BaseController::IGNORED_PARAMS)
            
      render :json => @myDynamicObject ? {:success => true} : {:success => false}
    end

    # delete a dynamic data record
    def delete
      @myDynamicObject = DynamicFormModel.get_constant(params[:model_name])
      @myDynamicObject.destroy(params[:id])
      render :json => {:success => true}
    end
      
  end
end
