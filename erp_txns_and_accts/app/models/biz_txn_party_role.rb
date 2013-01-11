class BizTxnPartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :biz_txn_event
  belongs_to :party
  belongs_to :biz_txn_party_role_type

end
