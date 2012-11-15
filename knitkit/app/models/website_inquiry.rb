class WebsiteInquiry < ActiveRecord::Base
  belongs_to :website
  belongs_to :user

  acts_as_dynamic_form_model
  has_dynamic_forms
	has_dynamic_data
  has_dynamic_solr_search if $USE_SOLR_FOR_DYNAMIC_FORM_MODELS

  def send_email(subject='')
    begin
      WebsiteInquiryMailer.inquiry(self, subject).deliver
    rescue Exception => e
      system_user = Party.find_by_description('Compass AE')
      AuditLog.custom_application_log_message(system_user, e)
    end
  end
end
