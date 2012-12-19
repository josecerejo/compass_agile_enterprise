require 'nokogiri'
require 'acts-as-taggable-on'
require 'zip/zip'
require 'zip/zipfilesystem'

module Knitkit
  class Engine < Rails::Engine
    isolate_namespace Knitkit

    config.knitkit = Knitkit::Config
	
	  initializer "knikit.merge_public" do |app|
      app.middleware.insert_before Rack::Lock, ::ActionDispatch::Static, "#{root}/public"
    end

	  ActiveSupport.on_load(:active_record) do
      include Knitkit::Extensions::ActiveRecord::ActsAsPublishable
      include Knitkit::Extensions::ActiveRecord::ThemeSupport::HasManyThemes
      include Knitkit::Extensions::ActiveRecord::ActsAsDocument
    end

    ActiveSupport.on_load(:action_controller) do
      include Knitkit::Extensions::ActionController::ThemeSupport::ActsAsThemedController
    end

    ActiveSupport.on_load(:action_mailer) do
      include Knitkit::Extensions::ActionMailer::ThemeSupport::ActsAsThemedMailer
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
    ::ErpApp::Widgets::Loader.load_compass_ae_widgets(config, self)
    
  end#Engine
end#Knitkit