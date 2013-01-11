class PartyResourceAvailability < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :party
  belongs_to :party_resource_availability_type, :foreign_key => 'pra_type_id', :class_name => 'PartyResourceAvailabilityType'

end
