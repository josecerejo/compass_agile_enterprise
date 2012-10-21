class Ticket < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :user, :foreign_key => 'assigned_to_id'

  has_file_assets
  has_dynamic_forms
  has_dynamic_data
  acts_as_commentable
  
  def send_email(subject='')
    begin
      WebsiteInquiryMailer.inquiry(self, subject).deliver
    rescue Exception => e
      system_user = Party.find_by_description('Compass AE')
      AuditLog.custom_application_log_message(system_user, e)
    end
  end
end
