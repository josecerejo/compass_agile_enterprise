class BizTxnEventDesc < ActiveRecord::Base
  attr_protected :created_at, :updated_at

	belongs_to :biz_txn_event

end
