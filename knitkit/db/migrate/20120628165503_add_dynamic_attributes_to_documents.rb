class AddDynamicAttributesToDocuments < ActiveRecord::Migration
  def change
    add_column :documents, :dynamic_attributes, :text
  end
end
