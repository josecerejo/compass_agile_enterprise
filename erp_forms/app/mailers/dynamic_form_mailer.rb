class DynamicFormMailer < ActionMailer::Base

  # def widget_email(form, dynamicObject, subject='')
  #   subject = "#{model_name} Submission" if subject.blank?
  #   @dynamicObject = dynamicObject

  #   mail( :to => form.widget_email_recipients,
  #         :from => ErpTechSvcs::Config.email_notifications_from,
  #         :subject => subject,
  #         :content_type => 'text/plain'
  #       )
  # end

  # uses mail_alternatives_with_attachments gem
  # ActionMailer doesn't handle attachments well without this gem
  def widget_email_with_attachments(form, dynamicObject, subject='', files=[])
    related_fields = dynamicObject.form.related_fields rescue []
    @dynamicData = dynamicObject.data.dynamic_attributes_with_related_data(related_fields, true)
    subject = "#{model_name} Submission" if subject.blank?
    message = prepare_message to: form.widget_email_recipients, from: ErpTechSvcs::Config.email_notifications_from, subject: subject, :content_type => "multipart/mixed"

    message.alternative_content_types_with_attachment(
      :text => render_to_string(:template => "dynamic_form_mailer/widget_email_with_attachments.text"),
      :html => render_to_string(:template => "dynamic_form_mailer/widget_email_with_attachments.html")
    ) do |inline_attachments|
      files.each do |f|
        attachments.inline[f.original_filename] = f.tempfile.read
      end
    end

    message
  end

end

