class BankAccountType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :bank_accounts
end
