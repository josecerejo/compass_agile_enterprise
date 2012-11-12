module RailsDbAdmin
  class Engine < Rails::Engine
    isolate_namespace RailsDbAdmin

    config.rails_db_admin = RailsDbAdmin::Config
    
    initializer "rails_db_admin.merge_public" do |app|
      app.middleware.insert_before Rack::Lock, ::ActionDispatch::Static, "#{root}/public"
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)
    
  end
end
