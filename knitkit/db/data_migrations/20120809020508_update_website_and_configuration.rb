class UpdateWebsiteAndConfiguration < ActiveRecord::Migration
  def self.up
    content_work_flow_category = Category.create(:description => 'Content Workflow', :internal_identifier => 'content_workflow')

    website_setup_category = Category.find_by_internal_identifier('website_setup')
    configuration = ::Configuration.find_template('default_website_configuration')

    yes_option = ConfigurationOption.find_by_internal_identifier('yes')
    yes_option = ConfigurationOption.create(
        :description => 'Yes',
        :internal_identifier => 'yes',
        :value => 'yes'
    ) if yes_option.nil?

    no_option = ConfigurationOption.find_by_internal_identifier('no')
    no_option = ConfigurationOption.create(
        :description => 'No',
        :internal_identifier => 'no',
        :value => 'no'
    ) if no_option.nil?

    #add email inquiries config
    email_inquiries_config_item_type = ConfigurationItemType.create(
        :description => 'Email inquiries',
        :internal_identifier => 'email_inquiries'
    )
    email_inquiries_config_item_type.configuration_options << yes_option
    email_inquiries_config_item_type.add_default_option(no_option)
    CategoryClassification.create(:category => website_setup_category, :classification => email_inquiries_config_item_type)

    configuration.configuration_item_types << email_inquiries_config_item_type

    #add auto activate publications
    auto_activate_config_item_type = ConfigurationItemType.create(
        :description => 'Auto activate publications',
        :internal_identifier => 'auto_active_publications'
    )
    auto_activate_config_item_type.configuration_options << no_option
    auto_activate_config_item_type.add_default_option(yes_option)
    CategoryClassification.create(:category => content_work_flow_category, :classification => auto_activate_config_item_type)

    configuration.configuration_item_types << auto_activate_config_item_type

    #add auto publish on save
    publish_on_save_config_item_type = ConfigurationItemType.create(
        :description => 'Publish on save',
        :internal_identifier => 'publish_on_save'
    )
    publish_on_save_config_item_type.configuration_options << no_option
    publish_on_save_config_item_type.add_default_option(yes_option)
    CategoryClassification.create(:category => content_work_flow_category, :classification => publish_on_save_config_item_type)

    configuration.configuration_item_types << publish_on_save_config_item_type

    Website.all.each do |website|
      website_config = website.configurations.first
      #add types
      website_config.configuration_item_types << email_inquiries_config_item_type
      website_config.configuration_item_types << auto_activate_config_item_type
      website_config.configuration_item_types << publish_on_save_config_item_type

      website_config.add_configuration_item(email_inquiries_config_item_type, (website.email_inquiries ? :yes : :no))
      website_config.add_configuration_item(auto_activate_config_item_type, (website.auto_activate_publication ? :yes : :no))
      website_config.add_configuration_item(publish_on_save_config_item_type, (website.auto_activate_publication ? :no : :yes))

      website_config.save
    end

    remove_column(:websites, :email) if columns(:websites).collect {|c| c.name}.include?('email')

    remove_column(:websites, :auto_activate_publication) if columns(:websites).collect {|c| c.name}.include?('auto_activate_publication')
    remove_column(:websites, :email_inquiries) if columns(:websites).collect {|c| c.name}.include?('email_inquiries')
  end

  def self.down
  end
end
