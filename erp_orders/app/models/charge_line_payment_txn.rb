class ChargeLinePaymentTxn < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :charge_line
  belongs_to :payment_txn, :polymorphic => true
  belongs_to :financial_txn, :class_name => "FinancialTxn",:foreign_key => "payment_txn_id"
end