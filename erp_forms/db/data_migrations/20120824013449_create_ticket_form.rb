class CreateTicketForm
  
  def self.up
    #insert data here
    fields = []

    fields << DynamicFormField.textfield({:fieldLabel => 'Title', :name => 'title', :width => 250, :allowblank => false })
    fields << DynamicFormField.combobox([['open', 'Open'],['closed', 'Closed']],{:fieldLabel => 'Status', :name => 'status', :width => 250, :allowblank => false })
    fields << DynamicFormField.combobox([ ['compass_ae_console', 'compass_ae_console'],
                                          ['compass_ae_starter_kit', 'compass_ae_starter_kit'],
                                          ['data_migrator', 'data_migrator'],
                                          ['erp_agreements', 'erp_agreements'],
                                          ['erp_app', 'erp_app'],
                                          ['erp_base_erp_svcs', 'erp_base_erp_svcs'],
                                          ['erp_commerce', 'erp_commerce'],
                                          ['erp_communication_events', 'erp_communication_events'],
                                          ['erp_dev_svcs', 'erp_dev_svcs'],
                                          ['erp_financial_accounting', 'erp_financial_accounting'],
                                          ['erp_forms', 'erp_forms'],
                                          ['erp_inventory', 'erp_inventory'],
                                          ['erp_invoicing', 'erp_invoicing'],
                                          ['erp_offers', 'erp_offers'],
                                          ['erp_orders', 'erp_orders'],
                                          ['erp_products', 'erp_products'],
                                          ['erp_rules', 'erp_rules'],
                                          ['erp_search', 'erp_search'],
                                          ['erp_tech_svcs', 'erp_tech_svcs'],
                                          ['erp_txns_and_accts', 'erp_txns_and_accts'],
                                          ['erp_work_effort', 'erp_work_effort'],
                                          ['erp_workflow', 'erp_workflow'],
                                          ['knitkit', 'knitkit'],
                                          ['master_data_management', 'master_data_management'],
                                          ['prismpay', 'prismpay'],
                                          ['rails_db_admin', 'rails_db_admin'],
                                          ['tenancy', 'tenancy'],
                                          ['timeshare', 'timeshare']
                                        ],
                                        {:fieldLabel => 'Product', :name => 'product', :width => 250, :allowblank => false })
    fields << DynamicFormField.combobox([['none', 'None']],{:fieldLabel => 'Project', :name => 'project', :width => 250, :allowblank => false })
    fields << DynamicFormField.related_combobox('User','username',{:fieldLabel => 'Assigned To', :name => 'assigned_to_id', :width => 250, :allowblank => false })
    fields << DynamicFormField.textarea({:fieldLabel => 'Body', :name => 'body', :width => 400, :height => 200, :allowblank => false })    

    d = DynamicForm.new
    d.description = 'Ticket Form'
    d.definition = fields.to_json
    d.model_name = 'Ticket'
    d.internal_identifier = 'ticket'
    d.default = true
    d.dynamic_form_model = DynamicFormModel.create(:model_name => 'Ticket')
    d.save
  end
  
  def self.down
    #remove data here
    DynamicForm.find_by_internal_identifier('ticket').destroy
    DynamicFormModel.find_by_model_name('Ticket').destroy
  end

end
