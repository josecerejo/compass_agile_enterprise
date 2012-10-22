class DynamicForms < ActiveRecord::Migration
  def self.up
    unless table_exists?(:dynamic_form_models)
      create_table :dynamic_form_models do |t|
        t.string :model_name
        t.boolean :show_in_multitask, :default => false 

        t.timestamps
      end
    end

    unless table_exists?(:dynamic_form_documents)
      create_table :dynamic_form_documents do |t|
        t.integer :dynamic_form_model_id
        t.string :type

        t.timestamps
      end

      add_index :dynamic_form_documents, :dynamic_form_model_id
      add_index :dynamic_form_documents, :type
    end

    unless table_exists?(:dynamic_forms)
      create_table :dynamic_forms do |t|
        t.string :description
        t.text :definition        
        t.integer :dynamic_form_model_id
        t.string :model_name
        t.string :internal_identifier
        t.boolean :default
        t.string  :widget_action, :default => 'save' 
        t.string :widget_email_recipients 
        t.boolean :focus_first_field, :default => true 
        t.boolean :submit_empty_text, :default => false 
        t.string :msg_target
        t.string :submit_button_label, :default => 'Submit'
        t.string :cancel_button_label, :default => 'Cancel'
        t.text :comment

        t.integer :created_by_id
        t.integer :updated_by_id

        t.timestamps
      end

      add_index :dynamic_forms, :created_by_id
      add_index :dynamic_forms, :updated_by_id
      add_index :dynamic_forms, :dynamic_form_model_id
      add_index :dynamic_forms, :model_name
      add_index :dynamic_forms, :internal_identifier
    end

    unless table_exists?(:dynamic_data)
      create_table :dynamic_data do |t|
        t.string :reference_type
        t.integer :reference_id
        t.text :dynamic_attributes        

        t.integer :created_with_form_id
        t.integer :updated_with_form_id

        t.integer :created_by_id
        t.integer :updated_by_id

        t.timestamps
      end

      add_index :dynamic_data, :created_with_form_id
      add_index :dynamic_data, :updated_with_form_id
      add_index :dynamic_data, :created_by_id
      add_index :dynamic_data, :updated_by_id
      add_index :dynamic_data, :reference_type
      add_index :dynamic_data, :reference_id
    end

  end

  def self.down
    [ :dynamic_form_models, 
      :dynamic_form_documents,
      :dynamic_forms, 
      :dynamic_data
    ].each do |tbl|
      if table_exists?(tbl)
        drop_table tbl
      end
    end
    
  end
end
