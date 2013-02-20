class AddProductInstancesNestedSetIndexes < ActiveRecord::Migration
  def up
    add_index :product_instances, :lft, :name => 'lft_index' unless indexes(:product_instances).collect {|i| i.name}.include?('lft_index')    
    add_index :product_instances, :rgt, :name => 'rgt_index' unless indexes(:product_instances).collect {|i| i.name}.include?('rgt_index')
  end

  def down
  end
end
