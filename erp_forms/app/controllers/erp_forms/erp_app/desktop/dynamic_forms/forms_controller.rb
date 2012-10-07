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

    render :json => dform.definition
  end

  # get a single form record
  def get_record
    render :json => [DynamicForm.find_by_id(params[:id])]
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
    related_model = params[:model].camelize.constantize
    data = related_model.all

    render :inline => data.to_json(:only => [:id, params[:displayField].to_sym])
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
    dform.description = params[:description] if params[:description]
    dform.definition = params[:form_definition] if params[:form_definition]
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
      dform.description = params[:description]
      dform.definition = params[:form_definition]
      dform.model_name = params[:model_name]
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
  
end
