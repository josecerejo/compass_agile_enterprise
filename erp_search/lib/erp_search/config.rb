module ErpSearch
  module Config
    class << self
      attr_accessor :use_solr_for_content, :use_solr_for_dynamic_form_models

      def init!
        @defaults = {
            :@use_solr_for_content => ErpSearch::Engine::USE_SOLR_FOR_CONTENT, 
            :@use_solr_for_dynamic_form_models => ErpSearch::Engine::USE_SOLR_FOR_DYNAMIC_FORM_MODELS,
            :@use_party_search_facts => ErpSearch::Engine::USE_PARTY_SEARCH_FACTS
        }
      end

      def reset!
        @defaults.each do |k, v|
          instance_variable_set(k, v)
        end
      end

      def configure(&blk)
        @configure_blk = blk
      end

      def configure!
        @configure_blk.call(self) if @configure_blk
      end
    end
    init!
    reset!
  end
end
