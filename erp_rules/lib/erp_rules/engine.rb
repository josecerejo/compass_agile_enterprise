module ErpRules
  require "erp_base_erp_svcs"
  class Engine < Rails::Engine
    isolate_namespace ErpRules

    ActiveSupport.on_load :active_record do
      include ErpRules::Extensions::ActiveRecord::HasRuleContext
      include ErpRules::Extensions::ActiveRecord::ActsAsBusinessRule
      include ErpRules::Extensions::ActiveRecord::ActsAsSearchFilter
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
