module ErpAgreements
  class Engine < Rails::Engine
    isolate_namespace ErpAgreements

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
