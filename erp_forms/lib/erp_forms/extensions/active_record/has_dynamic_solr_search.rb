# require 'sunspot'
# Sunspot::Setup.class_eval do
#   def self.clear_setup_for_class(klass)
#     Rails.logger.info "clear_setup_for_class"
#     Sunspot.searchable.delete!(klass)
#     Rails.logger.info "searchable #{Sunspot.searchable.inspect}"
#     #Rails.logger.info "field_factories #{field_factories.inspect}"
#     Rails.logger.info "setups[klass.name.to_sym] #{setups.keys}"
#     setups.delete_if{|key, value| key == klass.name.to_sym }
#     #setups[klass.name.to_sym] = new(clazz)
#     Rails.logger.info "setups[klass.name.to_sym] #{setups.keys}"
#   end
# end

# Sunspot::ClassSet.class_eval do
#   def delete!(klass)
#     @name_to_klass.delete_if{|key, value| key == klass.name.to_sym }
#   end
# end

#TODO: this needs to be moved into erp_search in a class_eval

module ErpForms
  module Extensions
    module ActiveRecord
      module HasDynamicSolrSearch
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def is_searchable?
            respond_to?(:solr_search)
          end

          def has_dynamic_solr_search
            include HasDynamicSolrSearch::InstanceMethods   
            
            extend Sunspot::Rails::Searchable::ClassMethods
            include Sunspot::Rails::Searchable::InstanceMethods

            class_attribute :sunspot_options
            
            before_save :mark_for_auto_indexing_or_removal
            after_save :perform_index_tasks

            after_destroy do |searchable|
              searchable.remove_from_index
            end
            
            # init search setup
            self.sunspot_setup                       
          end

          def sunspot_setup(options={})
            klass = DynamicFormModel.get_constant(self.name)
            #Sunspot::Setup.clear_setup_for_class(klass)
            definition = DynamicForm.get_form(self.name).definition_object rescue nil

            unless definition.nil?
              #Rails.logger.info "calling sunspot setup"
              Sunspot.setup(klass) do
                integer :id
                date :created_at do data.created_at end
                date :updated_at do data.updated_at end
                string :created_by do data.created_by.username rescue nil end
                string :updated_by do data.updated_by.username rescue nil end
                definition.each do |f|
                  next unless f[:searchable]
                  atype = convert_xtype_to_attribute_type(f[:xtype])
                  # respond_to allows us to support both static and dynamic attributes on model
                  if self.respond_to?(f[:name].to_sym)
                    send('text', f[:name].to_sym) if atype == 'string' # enable full text search for strings
                    send(atype, f[:name].to_sym) # configure attribute fields for scoping, faceting, ordering, etc
                  else
                    dyn_attr_key = DynamicDatum::DYNAMIC_ATTRIBUTE_PREFIX + f[:name]
                    if f[:xtype] == 'related_combobox'
                      extraction_block = proc { DynamicDatum.related_data_value(f[:extraParams]['model'], data.send(dyn_attr_key), f[:displayField]) }
                    else
                      extraction_block = proc { data.send(dyn_attr_key) }
                    end
                    send('text', f[:name].to_sym, &extraction_block) if atype == 'string' # enable full text search for strings
                    send(atype, f[:name].to_sym, &extraction_block) # configure attribute fields for scoping, faceting, ordering, etc
                  end
                end
              end
            end

            self.sunspot_options = options
          end

          def convert_xtype_to_attribute_type(xtype)
            case xtype
            when 'numberfield'
              return 'integer'
            when 'checkbox'
              return 'boolean'
            when 'datefield'
              return 'date'
            when 'timefield'
              return 'time'
            else
              return 'string'
            end
          end
        end
      
        module InstanceMethods

          def sunspot_setup(options={})
            self.class.sunspot_setup(options)
          end

        end 
      end
    end
  end
end
