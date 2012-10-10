class CapabilityType < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  has_many :capabilities
end
