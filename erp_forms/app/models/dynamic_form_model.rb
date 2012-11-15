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

  def self.sunspot_setup_all
    DynamicFormModel.all.each do |m|
      next if m.model_name == 'DynamicFormDocument'
      m.get_constant.sunspot_setup unless DynamicFormModel.class_exists?(m.model_name)
    end
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

  # checks to see if class name exists as a static model or has already been declared
  # used with sunspot_setup_all
  def self.class_exists?(class_name)
    result = nil
    begin
      klass = Module.const_get(class_name)
      result = (klass.is_a?(Class) ? ((klass.superclass == ActiveRecord::Base or klass.superclass == DynamicFormModel) ? true : nil) : nil)
    rescue NameError
      result = nil
    end
    result
  end

  def self.get_instance(klass_name)
    DynamicFormModel.get_constant(klass_name).new
  end

  def get_constant
    DynamicFormModel.get_constant(self.model_name)
  end

  def get_instance
    DynamicFormModel.get_instance(self.model_name)
  end

end