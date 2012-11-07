module ErpTxnsAndAccts
  class Engine < Rails::Engine
    isolate_namespace ErpTxnsAndAccts
	
    ActiveSupport.on_load(:active_record) do
      include ErpTxnsAndAccts::Extensions::ActiveRecord::ActsAsBizTxnAccount
      include ErpTxnsAndAccts::Extensions::ActiveRecord::ActsAsBizTxnEvent
      include ErpTxnsAndAccts::Extensions::ActiveRecord::ActsAsFinancialTxnAccount
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)

  end
end
