module CompassAeSencha
  class Engine < Rails::Engine
    isolate_namespace CompassAeSencha

    initializer "compass_ae_sencha_assets.merge_public" do |app|
      app.middleware.insert_before Rack::Lock, ::ActionDispatch::Static, "#{root}/public"
    end

  end
end
