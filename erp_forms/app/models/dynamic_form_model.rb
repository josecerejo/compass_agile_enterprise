class DynamicFormModel < ActiveRecord::Base
  has_many :dynamic_form_documents
  has_many :dynamic_forms, :dependent => :destroy
  after_create  :create_role

  def create_role
    Role.create(:description => self.model_name.titleize.pluralize, :internal_identifier => role_iid) if self.role.nil?
  end

  def role_iid
    "dynamic_form_model_#{self.model_name}"
  end

  def role
    Role.iid(role_iid)
  end

  def self.get_constant(klass_name)
  	result = nil
  	begin
      result = klass_name.constantize
    rescue
      DynamicFormDocument.declare(klass_name)
      result = klass_name.constantize
    end
  	result
  end

  def self.get_instance(klass_name)
    DynamicFormModel.get_constant(klass_name).new
  end

  # handles both static and dynamic attributes
  def self.assign_all_attributes(dynamicObject, params, ignored_params=[])    
    params.each do |k,v|
      k = k.to_s
      unless ignored_params.include?(k) or k == '' or k == '_'
        if dynamicObject.attributes.include?(k)
          dynamicObject.send(k + '=', v) 
        else
          if ['created_by','updated_by','created_at','updated_at','created_with_form_id','updated_with_form_id'].include?(k)
            key = k + '='
          else
            key = DynamicDatum::DYNAMIC_ATTRIBUTE_PREFIX + k + '='
          end
          
          dynamicObject.data.send(key, v) 
        end
      end
    end

    dynamicObject
  end

  # handles both static and dynamic attributes
  def self.save_all_attributes(dynamicObject, params, ignored_params=[])
    DynamicFormModel.assign_all_attributes(dynamicObject, params, ignored_params)
    (dynamicObject.valid? and dynamicObject.save) ? dynamicObject : nil
  end

end