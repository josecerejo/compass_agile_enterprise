module ErpApp
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module TagHelper
            include ::ActionView::Helpers::UrlHelper
            include ::ActionView::Helpers::TagHelper

            def link_to_remote(name, url, options={})
              #add ajax_replace class
              options[:class].nil? ? 'ajax_replace' : "#{options[:class]} ajax_replace"
              #add remote => true to options
              options.merge!({:remote => true})
              link_to name, url, options
            end
  
            def form_remote_tag(url, options={}, &block)
              #add ajax_replace class
              options[:class].nil? ? 'ajax_replace' : "#{options[:class]} ajax_replace"
              #add remote => true to options
              options.merge!({:remote => true})
              form_tag url, options do
                yield
              end
            end
            
          end#TagHelper
        end#Helpers
      end#ActionView
    end#Railties
  end#Extensions
end#ErpApp
