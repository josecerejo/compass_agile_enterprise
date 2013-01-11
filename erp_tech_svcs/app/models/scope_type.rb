class ScopeType < ActiveRecord::Base
  attr_accessible :description, :internal_identifier

  has_many :capabilities

end