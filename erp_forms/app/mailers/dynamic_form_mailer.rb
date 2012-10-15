class DynamicFormMailer < ActionMailer::Base

  def widget_email(form, dynamicObject, subject='')
    subject = "#{model_name} Submission" if subject.blank?
    @dynamicObject = dynamicObject
    mail( :to => form.widget_email_recipients,
          :from => ErpTechSvcs::Config.email_notifications_from,
          :subject => subject,
          :content_type => 'text/plain'
         )
  end
end

