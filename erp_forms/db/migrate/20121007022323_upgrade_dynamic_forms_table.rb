class UpgradeDynamicFormsTable < ActiveRecord::Migration
  def self.up
    add_column :dynamic_forms, :email_or_save, :string, :default => 'save' unless columns(:dynamic_forms).collect {|c| c.name}.include?('email_or_save')
    add_column :dynamic_forms, :email_recipients, :string unless columns(:dynamic_forms).collect {|c| c.name}.include?('email_recipients')
    add_column :dynamic_forms, :focus_first_field, :boolean, :default => true unless columns(:dynamic_forms).collect {|c| c.name}.include?('focus_first_field')
    add_column :dynamic_forms, :show_in_multitask, :boolean, :default => false unless columns(:dynamic_forms).collect {|c| c.name}.include?('show_in_multitask')
    add_column :dynamic_forms, :submit_empty_text, :boolean, :default => false unless columns(:dynamic_forms).collect {|c| c.name}.include?('submit_empty_text')
    add_column :dynamic_forms, :msg_target, :string unless columns(:dynamic_forms).collect {|c| c.name}.include?('msg_target')
    add_column :dynamic_forms, :submit_button_label, :string, :default => 'Submit' unless columns(:dynamic_forms).collect {|c| c.name}.include?('submit_button_label')
    add_column :dynamic_forms, :cancel_button_label, :string, :default => 'Cancel' unless columns(:dynamic_forms).collect {|c| c.name}.include?('cancel_button_label')
  end

  def self.down
    remove_column :dynamic_forms, :email_or_save if columns(:dynamic_forms).collect {|c| c.name}.include?('email_or_save')
    remove_column :dynamic_forms, :email_recipients if columns(:dynamic_forms).collect {|c| c.name}.include?('email_recipients')
    remove_column :dynamic_forms, :focus_first_field if columns(:dynamic_forms).collect {|c| c.name}.include?('focus_first_field')
    remove_column :dynamic_forms, :show_in_multitask if columns(:dynamic_forms).collect {|c| c.name}.include?('show_in_multitask')
    remove_column :dynamic_forms, :submit_empty_text if columns(:dynamic_forms).collect {|c| c.name}.include?('submit_empty_text')
    remove_column :dynamic_forms, :msg_target if columns(:dynamic_forms).collect {|c| c.name}.include?('msg_target')
    remove_column :dynamic_forms, :submit_button_label if columns(:dynamic_forms).collect {|c| c.name}.include?('submit_button_label')
    remove_column :dynamic_forms, :cancel_button_label if columns(:dynamic_forms).collect {|c| c.name}.include?('cancel_button_label')
  end
end
