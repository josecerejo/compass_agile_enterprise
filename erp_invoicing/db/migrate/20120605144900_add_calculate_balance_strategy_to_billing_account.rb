class AddCalculateBalanceStrategyToBillingAccount < ActiveRecord::Migration
  def change
    add_column :billing_accounts, :calculate_balance_strategy_type_id, :integer

    add_index :billing_accounts, :calculate_balance_strategy_type_id
  end
end
