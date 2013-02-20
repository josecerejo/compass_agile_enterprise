class CompassAeInstancePartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :compass_ae_instance
  belongs_to  :party
  belongs_to  :role_type

end