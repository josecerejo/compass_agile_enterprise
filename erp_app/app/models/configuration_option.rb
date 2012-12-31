class ConfigurationOption < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  validates :internal_identifier, :uniqueness => {:scope => :id, :case_sensitive => false}

  has_many :configuration_item_type_configuration_options
  has_many :configuration_item_types, :through => :configuration_item_type_configuration_options
  has_and_belongs_to_many :configuration_items

  validates :value, :presence => {:message => 'Value can not be blank.'}

  def to_js_hash
    {
      :id => self.id,
      :value => self.value,
      :description => self.description,
      :internalIdentifier => self.internal_identifier,
      :comment => self.comment,
      :createdAt => self.created_at,
      :updatedAt => self.updated_at
    }
  end
end
