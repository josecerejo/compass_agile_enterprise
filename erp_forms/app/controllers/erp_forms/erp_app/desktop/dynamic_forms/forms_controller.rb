class ErpForms::ErpApp::Desktop::DynamicForms::FormsController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController
  
  # get tree of dynamic models and forms
  def get_tree
    models = params[:node] == "root" ? DynamicFormModel.all(:order => :model_name) : DynamicFormModel.find_all_by_id(id)
    tree = []

    models.each do |form_model|
      # DynamicFormDocument only exists for the purpose of Extending
      next if form_model.model_name == 'DynamicFormDocument'
      
      model_hash = {
        :text => form_model.model_name,
        :iconCls => 'icon-data',
        :id => "form_model_#{form_model.id}",
        :modelId => form_model.id,
        :isModel => true, 
        :isForm => false, 
        :leaf => false,
        :children => []
      }

      #handle sections
      form_model.dynamic_forms.each do |form|
        form_hash = {
          :text => form.description, 
          :iconCls => (form.default ? 'icon-document_ok' : 'icon-document'), 
          :id => "form_#{form.id}",
          :formId => form.id, 
          :isModel => false, 
          :isDefault => form.default,
          :modelName => form_model.model_name,
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
    form = DynamicForm.get_form(params[:model_name], params[:internal_identifier])

    render :json => form.definition
  end

  # get a single form
  def get
    dform = DynamicForm.find_by_id(params[:id]) if params[:id]
    dform = DynamicForm.get_form(params[:model_name]) if dform.nil? and params[:model_name]

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
    
  end

  # update dynamic form
  def update
    
  end
  
  # create dynamic form
  def create
    
  end
  
end
