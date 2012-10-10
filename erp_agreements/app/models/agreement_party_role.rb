class AgreementPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :agreement
  belongs_to  :party
  belongs_to  :role_type

end
