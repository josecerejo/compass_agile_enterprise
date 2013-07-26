class AddPartyIdIdxToUsers < ActiveRecord::Migration
  def up
    add_index :users, :party_id, :name => 'users_party_id_idx' unless indexes(:users).collect {|i| i.name}.include?('users_party_id_idx')    
  end

  def down
    remove_index :users, :party_id if indexes(:users).collect {|i| i.name}.include?('users_party_id_idx')    
  end
end
