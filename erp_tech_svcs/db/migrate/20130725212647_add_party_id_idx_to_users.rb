class AddPartyIdIdxToUsers < ActiveRecord::Migration
  def change
    add_index :users, :party_id
  end
end
