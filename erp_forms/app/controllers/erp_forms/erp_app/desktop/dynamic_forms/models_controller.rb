class ErpForms::ErpApp::Desktop::DynamicForms::ModelsController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController
  
  # get dynamic form models
  # used in dynamic forms widget combo box
  def index
    models = []
    dynamic_form_models = DynamicFormModel.where("model_name != 'DynamicFormDocument'").order('model_name ASC')
    dynamic_form_models.each do |m|
      model_hash = {
        :id => m.id,
        :model_name => m.model_name,
        :file_security_default => m.file_security_default,
        :show_in_multitask => m.show_in_multitask
      }
      
      models << model_hash
    end
    
    render :json => models
  end

  # set default form for this model
  def set_default_form
    myDynamicObject = DynamicFormModel.get_constant(params[:model_name])    
    myDynamicObject.set_default(params[:id])
	
    # update solr config for model
    DynamicFormModel.get_constant(params[:model_name]).sunspot_setup if ErpForms.use_solr?

    render :json => {:success => true}
  end

  # delete a dynamic form model
  def delete
    DynamicFormModel.destroy(params[:id])
	
    render :json => {:success => true}
  end
  
  # create a dynamic form model
  def create
    DynamicFormModel.create({
      :model_name => params[:model_name],
      :allow_comments => params[:allow_comments],
      :allow_files => params[:allow_files],
      :file_security_default => params[:file_security_default]
    })
	
    render :json => {:success => true}
  end

  # update a dynamic form model
  def update
    m = DynamicFormModel.find(params[:id])
    m.allow_comments = params[:allow_comments] unless params[:allow_comments].nil?
    m.allow_files = params[:allow_files] unless params[:allow_files].nil?
    m.file_security_default = params[:file_security_default] unless params[:file_security_default].blank?
    m.show_in_multitask = params[:show_in_multitask] unless params[:show_in_multitask].nil?
    m.save
    
    render :json => {:success => true}
  end
  
end
