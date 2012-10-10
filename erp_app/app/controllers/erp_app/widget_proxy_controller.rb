module ErpApp
	class WidgetProxyController < ErpApp::ApplicationController
	  
    attr_accessor :performed_redirect

    def index
      @widget_name = params[:widget_name]
      @widget_action = params[:widget_action]
      @uuid = params[:uuid]

      #get widget params
      widget_params = nil
      widget_params = JSON.parse(params[:widget_params]) unless params[:widget_params].blank?

      widget_obj = "::Widgets::#{@widget_name.camelize}::Base".constantize.new(self, @widget_name, @widget_action, @uuid, widget_params, @website)

      result = widget_obj.process(@widget_action)

      #if there was no result just return
      return if result.nil?

      if result.is_a?(Hash)
        render result
      else
        render :inline => result
      end
    end
    
	end
end
