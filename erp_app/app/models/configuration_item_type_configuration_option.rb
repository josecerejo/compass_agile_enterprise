class ConfigurationItemTypeConfigurationOption < ActiveRecord::Base
  attr_accessible :configuration_item_type, :configuration_option, :is_default

  self.table_name = 'configuration_item_types_configuration_options'

  belongs_to :configuration_item_type
  belongs_to :configuration_option

  def is_default?
    is_default
  end
end
