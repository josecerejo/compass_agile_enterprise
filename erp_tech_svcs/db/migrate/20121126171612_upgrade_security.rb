class UpgradeSecurity < ActiveRecord::Migration

  def self.up
    unless table_exists?(:capability_accessors)
      create_table :capability_accessors do |t|
        t.string :capability_accessor_record_type
        t.integer :capability_accessor_record_id
        t.integer :capability_id
        t.timestamps
      end

      add_index :capability_accessors, :capability_id
      add_index :capability_accessors, [:capability_accessor_record_id, :capability_accessor_record_type], :name => 'capability_accessor_record_index'
    end

    unless columns(:capabilities).collect {|c| c.name}.include?('scope_query')
      add_column :capabilities, :description, :string
      add_column :capabilities, :capability_resource_type, :string
      add_column :capabilities, :capability_resource_id, :integer
      add_column :capabilities, :scope_type_id, :integer
      add_column :capabilities, :scope_query, :text

      add_index :capabilities, :scope_type_id
      add_index :capabilities, [:capability_resource_id, :capability_resource_type], :name => 'capability_resource_index'
    end

    unless table_exists?(:scope_types)
      create_table :scope_types do |t|
        t.string :description
        t.string :internal_identifier
        t.timestamps
      end

      add_index :scope_types, :internal_identifier
    end

    unless table_exists?(:parties_security_roles)
      create_table :parties_security_roles, :id => false do |t|
        t.integer :party_id
        t.integer :security_role_id
      end

      add_index :parties_security_roles, :party_id
      add_index :parties_security_roles, :security_role_id
    end

    rename_table :roles, :security_roles unless table_exists?(:security_roles)

  end

  def self.down
  end
end
