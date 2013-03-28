require 'sunspot_rails'
require 'erp_base_erp_svcs'
require "erp_search/version"
require "erp_search/engine"

module ErpSearch

  def self.use_tenancy?
    ErpBaseErpSvcs.engine_loaded?('Tenancy')
  end
  
end
