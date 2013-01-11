class BaseTxnContext < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :txn_context_record, :polymorphic => true
  belongs_to  :biz_txn_event

end
