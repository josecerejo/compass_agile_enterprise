class AcceptedCreditCard < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :organization
end
