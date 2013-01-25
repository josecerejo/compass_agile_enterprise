module ErpSearch
  class Engine < Rails::Engine
    isolate_namespace ErpSearch

    initializer "erp_search.load_app_root" do |app|
      filename = File.join(app.root,"config/erp_search.yml") 
      if File.exists?(filename)
        config = YAML.load_file(filename)
        USE_SOLR_FOR_CONTENT = (config["use_solr_for_content"].nil? ? true : config["use_solr_for_content"])
        USE_SOLR_FOR_DYNAMIC_FORM_MODELS = (config["use_solr_for_dynamic_form_models"].nil? ? true : config["use_solr_for_dynamic_form_models"])
        USE_PARTY_SEARCH_FACTS = (config["use_party_search_facts"].nil? ? true : config["use_party_search_facts"])
      else
        USE_SOLR_FOR_CONTENT = true
        USE_SOLR_FOR_DYNAMIC_FORM_MODELS = true
        USE_PARTY_SEARCH_FACTS = true
      end

      require "erp_search/config"
      ErpSearch::Engine.config.erp_search = ErpSearch::Config

      ErpSearch::Engine.config.to_prepare do
        require "erp_search/extensions"
        ActiveSupport.on_load(:active_record) do
          include ErpSearch::Extensions::ActiveRecord::HasDynamicSolrSearch
        end
      end

      ErpSearch::Engine.config.after_initialize do
        # setup sunspot for all dynamic form models if we're using USE_SOLR_FOR_DYNAMIC_FORM_MODELS
        DynamicFormModel.sunspot_setup_all if Object.const_defined?('ErpForms') and ErpForms.use_solr? and ActiveRecord::Base.connection.table_exists?('dynamic_form_models')
      end

      if USE_PARTY_SEARCH_FACTS
        # Add observers (this is ugly need a better way)
        observers = [:party_observer, :contact_observer]
        (ErpSearch::Engine.config.active_record.observers.nil?) ? ErpSearch::Engine.config.active_record.observers = observers : ErpSearch::Engine.config.active_record.observers += observers
      end
    end

    ErpBaseErpSvcs.register_as_compass_ae_engine(config, self)
  end
end
