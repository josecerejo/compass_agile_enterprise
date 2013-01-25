require 'dynamic_attributes'

module ErpForms
  class Engine < Rails::Engine
    isolate_namespace ErpForms
    
	  initializer "erp_forms.merge_public" do |app|
      app.middleware.insert_before Rack::Lock, ::ActionDispatch::Static, "#{root}/public"
    end
	
    ActiveSupport.on_load(:active_record) do
      include ErpForms::Extensions::ActiveRecord::ActsAsDynamicFormModel
      include ErpForms::Extensions::ActiveRecord::HasDynamicData
      include ErpForms::Extensions::ActiveRecord::HasDynamicForms
      include ErpForms::Extensions::ActiveRecord::ActsAsCommentable
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)

    config.to_prepare do
      #dynamic_attributes patch
      require "erp_forms/dynamic_attributes_patch"
  	end
	
  end
end
