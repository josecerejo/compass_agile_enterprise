Rails::Initializer.configure do |config|
  
  config.reload_plugins = true

  config.set_dependencies(:erp_agreements, [:erp_base_erp_svcs])
end
