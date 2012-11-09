class ErpForms::ErpApp::Desktop::DynamicForms::FormsController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController
  
  # get tree of dynamic models and forms
  def get_tree
    models = params[:node] == "root" ? DynamicFormModel.all(:order => :model_name) : DynamicFormModel.find_all_by_id(params[:id])
    tree = []

    models.each do |form_model|
      # DynamicFormDocument only exists for the purpose of Extending
      next if form_model.model_name == 'DynamicFormDocument'
      
      model_hash = {
        :text => form_model.model_name,
        :iconCls => 'icon-data',
        :id => "form_model_#{form_model.id}",
        :formModelId => form_model.id,
        :isFormModel => true, 
        :file_security_default => form_model.file_security_default, 
        :show_in_multitask => form_model.show_in_multitask, 
        :isForm => false, 
        :leaf => false,
        :expanded => true,
        :children => []
      }

      #handle sections
      form_model.dynamic_forms.each do |form|
        form_hash = {
          :text => form.description, 
          :iconCls => (form.default ? 'icon-document_ok' : 'icon-document'), 
          :id => "form_#{form.id}",
          :formId => form.id, 
          :isFormModel => false, 
          :isDefaultForm => form.default,
          :formModelName => form_model.model_name,
          :isForm => true, 
          :leaf => true 
        }

        model_hash[:children] << form_hash
      end
            
      #added website to main tree
      tree << model_hash
    end

    render :json => tree
  end

  # get a single form definition
  def get_definition
    dform = DynamicForm.find_by_id(params[:id]) if params[:id]
    dform = DynamicForm.get_form(params[:model_name], params[:internal_identifier]) if dform.nil? and params[:model_name]

    if dform.nil?
      render :json => {:success => false}
    else
      render :json => dform.definition
    end
  end

  # get a single form record
  def get_record
    dform = DynamicForm.find(params[:id]) rescue nil

    unless dform.nil?
      dform_hash = dform.to_hash
      dform_hash[:created_by] = dform.created_by.username rescue 'Unknown'
      dform_hash[:updated_by] = dform.updated_by.username rescue 'Unknown'
      dform_hash[:created_at] = dform.created_at.getlocal.strftime(@@datetime_format)
      dform_hash[:updated_at] = dform.updated_at.getlocal.strftime(@@datetime_format)      
    end
    render :json => [dform_hash]
  end

  # get a single form
  def get
    dform = DynamicForm.find_by_id(params[:id]) if params[:id]
    dform = DynamicForm.get_form(params[:model_name], params[:internal_identifier]) if dform.nil? and params[:model_name]

    if dform.nil? 
      render :json => {:success => false, :error => "Don't know how to find form"} and return
    end      

    form = dform.to_extjs_formpanel(
                { :url => "/erp_forms/erp_app/desktop/dynamic_forms/data/#{params[:form_action]}",
                  :record_id => params[:record_id]
                })

    render :json => form
  end

  # get related data for a related field
  def related_field
    if params[:model].blank? or params[:displayField].blank?
      render :inline => '[]'
    else
      related_model = params[:model].camelize.constantize
      data = related_model.all
      render :inline => data.to_json(:only => [:id, params[:displayField].to_sym])
    end
  end

  # delete dynamic form
  def delete
    dform = DynamicForm.find_by_id(params[:id])
    unless dform.nil?
      begin
         dform.destroy 
         render :json => {:success => true}
      rescue Exception => e
        render :json => {:success => false, :error => e.message} 
      end         
    else
      render :json => {:success => false, :error => 'Could not find form.'}
    end
  end

  # update dynamic form
  def update
    dform = DynamicForm.find_by_id(params[:id])
    dform = assign_form_attributes(dform)
    dform.updated_by_id = current_user.id
    if dform.save
      render :json => {:success => true}
    else
      render :json => {:success => false}
    end
  end
  
  # create dynamic form
  def create
    if params[:form_definition] and params[:description] and params[:model_name]
      dform = DynamicForm.new
      dform = assign_form_attributes(dform)
      dform.dynamic_form_model_id = DynamicFormModel.find_by_model_name(params[:model_name]).id
      dform.default = false
      dform.created_by_id = current_user.id
      if dform.save
        render :json => {:success => true, :id => dform.id}
      else
        render :json => {:success => false}
      end    
    else
      render :json => {:success => false, :error => 'Insufficient info to create form.'}
    end
  end
  
  protected
  def assign_form_attributes(dform)
    dform.description = params[:description] unless params[:description].nil?
    dform.definition = params[:form_definition] unless params[:form_definition].nil?
    dform.model_name = params[:model_name] unless params[:model_name].nil?
    dform.widget_action = params[:widget_action] unless params[:widget_action].nil?
    dform.widget_email_recipients = params[:widget_email_recipients] unless params[:widget_email_recipients].nil?
    dform.focus_first_field = params[:focus_first_field] unless params[:focus_first_field].nil?
    dform.show_in_multitask = params[:show_in_multitask] unless params[:show_in_multitask].nil?
    dform.msg_target = params[:msg_target] unless params[:msg_target].nil?
    dform.submit_empty_text = params[:submit_empty_text] unless params[:submit_empty_text].nil?
    dform.submit_button_label = params[:submit_button_label] unless params[:submit_button_label].nil?
    dform.cancel_button_label = params[:cancel_button_label] unless params[:cancel_button_label].nil?
    dform.comment = params[:comment] unless params[:comment].nil?
    dform
  end

end
