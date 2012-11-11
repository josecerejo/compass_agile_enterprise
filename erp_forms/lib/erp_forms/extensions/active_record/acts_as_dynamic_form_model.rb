module ErpForms
  module Extensions
    module ActiveRecord
      module ActsAsDynamicFormModel

          def self.included(base)
            base.extend(ClassMethods)                     
          end

          module ClassMethods
            
            def acts_as_dynamic_form_model
              include ActsAsDynamicFormModel::InstanceMethods  
            end

            if !respond_to?(:is_searchable?)
              def is_searchable?
                false
              end
            end

          end
        
          module InstanceMethods

            def dynamic_model
              self.respond_to?(:dynamic_form_model) ? dynamic_form_model : DynamicFormModel.find_by_model_name(self.class.name)
            end

            def role_iid
              dynamic_model.role_iid
            end

            def role
              dynamic_model.role
            end

            def file_security_default
              dynamic_model.file_security_default
            end

            def show_in_multitask
              dynamic_model.show_in_multitask
            end

            # handles both static and dynamic attributes
            def assign_all_attributes(params, ignored_params=[])    
              params.each do |k,v|
                k = k.to_s
                unless ignored_params.include?(k) or k == '' or k == '_'
                  if self.attributes.include?(k)
                    self.send(k + '=', v) 
                  else
                    if ['created_by','updated_by','created_at','updated_at','created_with_form_id','updated_with_form_id'].include?(k)
                      key = k + '='
                    else
                      key = DynamicDatum::DYNAMIC_ATTRIBUTE_PREFIX + k + '='
                    end
                    
                    self.data.send(key, v) 
                  end
                end
              end

              self
            end

            # handles both static and dynamic attributes
            def save_all_attributes(params, ignored_params=[])
              self.assign_all_attributes(params, ignored_params)
              (self.valid? and self.save) ? self : nil
            end

          end 
      end
    end
  end
end
