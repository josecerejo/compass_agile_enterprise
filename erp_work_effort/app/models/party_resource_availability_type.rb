class PartyResourceAvailabilityType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :party_resource_availabilities

  def self.iid(internal_identifier)
  	 	self.where('internal_identifier = ?', internal_identifier).first
  end
end
