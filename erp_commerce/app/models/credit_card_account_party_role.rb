class CreditCardAccountPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :credit_card_account
  belongs_to :role_type
  belongs_to :party
  belongs_to :credit_card
end