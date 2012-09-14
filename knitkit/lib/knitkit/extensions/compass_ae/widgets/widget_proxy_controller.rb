ErpApp::WidgetProxyController.class_eval do
  attr_accessor :performed_redirect
  before_filter :set_website

  def index
    @widget_name = params[:widget_name]
    @widget_action = params[:widget_action]
    @uuid = params[:uuid]

    #get widget params
    widget_params = nil
    widget_params = JSON.parse(params[:widget_params]) unless params[:widget_params].blank?

    widget_obj = "::Widgets::#{@widget_name.camelize}::Base".constantize.new(self, @widget_name, @widget_action, @uuid, widget_params, @website)

    result = widget_obj.process(@widget_action)
    result.nil? ? return : (render result)
  end

  protected
  #setting website to pass to widgets
  def set_website
    @website = Website.find_by_host(request.host_with_port)
  end

end
