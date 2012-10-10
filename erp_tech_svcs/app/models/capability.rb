class Capability < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  has_roles

  belongs_to :capability_type
  has_and_belongs_to_many :capable_models

  alias :type :capability_type
end
