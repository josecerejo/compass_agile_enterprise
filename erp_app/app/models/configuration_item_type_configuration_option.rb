class ConfigurationItemTypeConfigurationOption < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  self.table_name = 'configuration_item_types_configuration_options'

  belongs_to :configuration_item_type
  belongs_to :configuration_option

  def is_default?
    is_default
  end
end
