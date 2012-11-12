module ErpFinancialAccounting
  class Engine < Rails::Engine
    isolate_namespace ErpFinancialAccounting

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
