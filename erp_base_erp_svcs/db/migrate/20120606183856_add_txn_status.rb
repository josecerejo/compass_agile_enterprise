class AddTxnStatus < ActiveRecord::Migration
  def up
    unless table_exists?(:status_applications)
      create_table :status_applications do |t|
        t.references :tracked_status_type
        t.references :status_application_record, :polymorphic => true
        t.datetime  :from_date
        t.datetime  :thru_date

        t.timestamps
      end

      add_index :status_applications, [:status_application_record_id, :status_application_record_type], :name => 'status_applications_record_idx'
      add_index :status_applications, :tracked_status_type_id, :name => 'tracked_status_type_id_idx'
      add_index :status_applications, :from_date, :name => 'from_date_idx'
      add_index :status_applications, :thru_date, :name => 'thru_date_idx'
    end

    unless table_exists?(:tracked_status_types)
      create_table :tracked_status_types do |t|
        t.string :description
        t.string :internal_identifier
        t.string :external_identifier

        t.timestamps
      end

      add_index :tracked_status_types, :internal_identifier, :name => 'tracked_status_types_iid_idx'
    end
  end

  def down
    drop_table :status_applications if table_exists?(:status_applications)
    drop_table :tracked_status_types if table_exists?(:tracked_status_types)
  end
end
