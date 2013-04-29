class DynamicFormDocument < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :dynamic_form_model

  acts_as_dynamic_form_model
  has_file_assets
  has_dynamic_forms
	has_dynamic_data
  acts_as_commentable

  # declare a subclass
  # pass in name of subclass
  def self.declare(klass_name)    
    Object.send(:remove_const, klass_name) if Object.const_defined?(klass_name) and !Rails.configuration.cache_classes
    Object.const_set(klass_name, Class.new(DynamicFormDocument)) unless Object.const_defined?(klass_name)
  end

  def send_email
    begin
      WebsiteInquiryMailer.inquiry(self).deliver
    rescue Exception => e
      system_user = Party.find_by_description('Compass AE')
      AuditLog.custom_application_log_message(system_user, e)
    end
  end
  
end