class DynamicFormModel < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
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

  def get_constant
    DynamicFormModel.get_constant(self.model_name)
  end

  def get_instance
    DynamicFormModel.get_instance(self.model_name)
  end

end