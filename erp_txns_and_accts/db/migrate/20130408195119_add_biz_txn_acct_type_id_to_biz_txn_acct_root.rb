class AddBizTxnAcctTypeIdToBizTxnAcctRoot < ActiveRecord::Migration
  def change
    add_column :biz_txn_acct_roots, :biz_txn_acct_type_id, :integer
  end
end
