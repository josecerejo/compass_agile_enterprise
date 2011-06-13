class ErpApp::WidgetProxyController < ErpApp::ApplicationController
  attr_accessor :performed_redirect

  def index
    @widget_name   = params[:widget_name]
    @widget_action = params[:widget_action]
    @uuid          = params[:uuid]

    #get widget params
    widget_params = nil
    widget_params = JSON.parse(params[:widget_params]) unless params[:widget_params].blank?

    widget_obj = "ErpApp::Widgets::#{@widget_name.camelize}::Base".constantize.new(self, @widget_name, @widget_action, @uuid, widget_params)
    
    action_results = widget_obj.send(@widget_action)
    
    respond_to do |format|
      format.html do
        render :inline => action_results, :layout => false
      end
      format.js do
        render :update do |page|          
          page.replace_html "#{@uuid}_result", :inline => action_results, :layout => false
        end
      end
    end

  end

  def user
    current_user
  end

  def authenticated?
    authorized?
  end
   
end
