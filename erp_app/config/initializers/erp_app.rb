Rails.application.config.erp_app.configure do |config|
  config.session_warn_after = 18 # in minutes
  config.session_redirect_after = 20 # in minutes
end
Rails.application.config.erp_app.configure!