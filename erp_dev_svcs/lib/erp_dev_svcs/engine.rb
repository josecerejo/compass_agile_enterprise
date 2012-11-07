module ErpDevSvcs
  class Engine < Rails::Engine
    isolate_namespace ErpDevSvcs

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
