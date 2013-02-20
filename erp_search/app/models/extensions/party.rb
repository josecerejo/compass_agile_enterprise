if ErpSearch::Engine::USE_PARTY_SEARCH_FACTS

  Party.class_eval do
    has_one :party_search_fact, :dependent => :destroy
  end
  
end