require 'uuid'

class AddUuidCompassAeInstance < ActiveRecord::Migration
  def self.up
    unless columns(:compass_ae_instances).collect {|c| c.name}.include?('guid')
      add_column :compass_ae_instances, :guid, :string
      add_index :compass_ae_instances, :guid, :name => "guid_idx"
    end
  end

  def self.down
    if columns(:compass_ae_instances).collect {|c| c.name}.include?('guid')
      remove_column :compass_ae_instances, :guid
    end
  end
end
