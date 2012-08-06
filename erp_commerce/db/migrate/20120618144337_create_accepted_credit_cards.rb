class CreateAcceptedCreditCards < ActiveRecord::Migration
  def change
    create_table :accepted_credit_cards do |t|

      t.references :organization
      t.string :card_type

      t.timestamps
    end
  end
end
