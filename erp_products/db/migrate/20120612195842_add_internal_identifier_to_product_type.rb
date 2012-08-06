class AddInternalIdentifierToProductType < ActiveRecord::Migration
  def self.up
    add_column :product_types, :internal_identifier, :string
  end

  def self.down
    remove_column :product_types, :internal_identifier
  end
end
