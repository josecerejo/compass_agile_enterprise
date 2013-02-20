if ErpSearch::Engine::USE_SOLR_FOR_DYNAMIC_FORM_MODELS

  Ticket.class_eval do
    has_dynamic_solr_search
  end

end