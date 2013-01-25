require 'sunspot_rails'
require 'erp_base_erp_svcs'
require "erp_search/version"
require "erp_search/engine"

module ErpSearch

  def self.use_tenancy?
    Object.const_defined?('Tenancy')
  end
  
end
