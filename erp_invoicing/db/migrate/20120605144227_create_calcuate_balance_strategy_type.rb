class CreateCalcuateBalanceStrategyType < ActiveRecord::Migration
  def up
    unless table_exists?(:calculate_balance_strategy_types)
      create_table :calculate_balance_strategy_types do |t|
        t.string :internal_identifier
        t.string :description

        t.timestamps
      end
    end
  end

  def down
    if table_exists?(:calculate_balance_strategy_types)
      drop_table  calculate_balance_strategy_types
    end
  end
end
