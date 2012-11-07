module ErpOrders
  class Engine < Rails::Engine
    isolate_namespace ErpOrders
    
    initializer "erp_orders_assets.merge_public" do |app|
      app.middleware.insert_before Rack::Lock, ::ActionDispatch::Static, "#{root}/public"
    end
	  
	  ActiveSupport.on_load(:active_record) do
      include ErpOrders::Extensions::ActiveRecord::ActsAsOrderTxn
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
