class ErpForms::ErpApp::Desktop::DynamicForms::BaseController < ::ErpApp::Desktop::BaseController
  @@datetime_format = "%m/%d/%Y %l:%M%P"
  IGNORED_PARAMS = %w{action controller uuid widget_name widget_action dynamic_form_id dynamic_form_model_id model_name use_dynamic_form authenticity_token file}

  protected  
  def page
    offset = params[:start].to_f
    offset > 0 ? (offset / params[:limit].to_f).to_i + 1 : 1
  end
  
  def per_page
    params[:limit].nil? ? 20 : params[:limit].to_i
  end  
end