class AddBalanceToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :balance_id, :integer
    add_column :invoices, :calculate_balance_strategy_type_id, :integer

    add_index   :invoices, :balance_id
    add_index   :invoices, :calculate_balance_strategy_type_id
  end
end
