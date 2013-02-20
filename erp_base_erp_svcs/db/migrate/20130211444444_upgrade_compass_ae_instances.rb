# This migration comes from erp_base_erp_svcs (originally 20130211444444)
class UpgradeCompassAeInstances < ActiveRecord::Migration
  def self.up
    unless columns(:compass_ae_instances).collect {|c| c.name}.include?('type')
      add_column :compass_ae_instances, :description, :string
      add_column :compass_ae_instances, :internal_identifier, :string
      add_column :compass_ae_instances, :type, :string
      add_column :compass_ae_instances, :schema, :string, :default => 'public'
      add_column :compass_ae_instances, :parent_id, :integer

      add_index :compass_ae_instances, :internal_identifier, :name => "iid_idx" 
      add_index :compass_ae_instances, :schema, :name => "schema_idx"
      add_index :compass_ae_instances, :type, :name => "type_idx"
      add_index :compass_ae_instances, :parent_id, :name => "parent_id_idx"
    end
  end

  unless table_exists?(:compass_ae_instance_party_roles)
    create_table :compass_ae_instance_party_roles do |t|
      t.string :description
      t.integer :compass_ae_instance_id
      t.integer :party_id
      t.integer :role_type_id
      
      t.timestamps
    end

    add_index :compass_ae_instance_party_roles, :compass_ae_instance_id, :name => "compass_ae_instance_id_idx"
    add_index :compass_ae_instance_party_roles, :party_id, :name => "party_id_idx"
    add_index :compass_ae_instance_party_roles, :role_type_id, :name => "role_type_id_idx"
  end
  
end