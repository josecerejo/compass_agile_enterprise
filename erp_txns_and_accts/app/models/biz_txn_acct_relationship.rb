class BizTxnAcctRelationship < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :account_from, :class_name => "BizTxnAcctRoot", :foreign_key => "biz_txn_acct_root_id_from"  
  belongs_to :account_to, :class_name => "BizTxnAcctRoot", :foreign_key => "biz_txn_acct_root_id_to"
  
  belongs_to :biz_txn_acct_rel_type

end
