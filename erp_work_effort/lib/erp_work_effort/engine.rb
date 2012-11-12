module ErpWorkEffort
  class Engine < Rails::Engine
    isolate_namespace ErpWorkEffort
    
    ActiveSupport.on_load(:active_record) do
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsProjectEffort
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsProjectRequirement
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsSupportEffort
      include ErpWorkEffort::Extensions::ActiveRecord::ActsAsSupportRequirement
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
