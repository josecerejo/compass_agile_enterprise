class CapabilityType < ActiveRecord::Base
  attr_accessible :internal_identifier, :description
  
  has_many :capabilities
end
