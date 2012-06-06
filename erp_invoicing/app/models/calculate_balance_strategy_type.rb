class CalculateBalanceStrategyType < ActiveRecord::Base
  has_many :billing_accounts

  def self.find_by_iid(iid)
    self.find_by_internal_identifier(iid)
  end

  def iid
    self.internal_identifier
  end
end