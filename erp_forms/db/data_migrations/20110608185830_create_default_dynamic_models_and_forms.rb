class CreateDefaultDynamicModelsAndForms
  
  def self.up
    #insert data here
    DynamicFormModel.create(:model_name => 'DynamicFormDocument')

    fields = []

    fields << DynamicFormField.textfield({:fieldLabel => 'First Name', :name => 'first_name', :width => 250, :allowBlank => false })
    fields << DynamicFormField.textfield({:fieldLabel => 'Last Name', :name => 'last_name', :width => 250, :allowBlank => false })
    fields << DynamicFormField.email({:fieldLabel => 'Email', :name => 'email', :width => 250, :allowBlank => false })
    fields << DynamicFormField.textarea({:fieldLabel => 'Message', :name => 'message', :width => 400, :height => 200, :allowBlank => false })    

    d = DynamicForm.new
    d.description = 'Contact Form'
    d.definition = fields.to_json
    d.model_name = 'WebsiteInquiry'
    d.internal_identifier = 'contact_us'
    d.default = true
    d.dynamic_form_model = DynamicFormModel.create(:model_name => 'WebsiteInquiry')
    d.comment = "This is the default form used by Knitkit's Contact Us Widget for Website Inquiries. NOTE: The Contact Us Widget uses Knitkit's website configuration options for email behavior & not the Dynamic Forms Widget Action setting."
    d.msg_target = 'qtip'
    d.save
  end
  
  def self.down
    #remove data here
    DynamicFormModel.delete_all
    DynamicForm.delete_all
  end

end
