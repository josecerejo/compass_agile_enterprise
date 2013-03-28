#compass libraries
require 'erp_base_erp_svcs'
require 'erp_tech_svcs'
require 'erp_app'

require "friendly_id"

require 'erp_forms/version'
require 'erp_forms/dynamic_form_field'
require 'erp_forms/dynamic_grid_column'
require 'erp_forms/dynamic_form_field'
require 'erp_forms/extensions/extensions'
require "erp_forms/engine"

module ErpForms

  def self.use_solr?
    ErpBaseErpSvcs.engine_loaded?('ErpSearch') and ErpSearch::Config.use_solr_for_dynamic_form_models
  end
end
