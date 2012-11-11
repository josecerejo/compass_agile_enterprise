class Ticket < ActiveRecord::Base
  belongs_to :user, :foreign_key => 'assigned_to_id'

  acts_as_dynamic_form_model
  has_file_assets
  has_dynamic_forms
  has_dynamic_data
  acts_as_commentable
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
