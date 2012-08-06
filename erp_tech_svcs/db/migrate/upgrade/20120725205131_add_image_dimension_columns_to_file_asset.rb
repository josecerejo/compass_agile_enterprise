class AddImageDimensionColumnsToFileAsset < ActiveRecord::Migration
  def self.up
    unless columns(:file_assets).collect {|c| c.name}.include?('width')
      add_column :file_assets, :width, :string
      add_column :file_assets, :height, :string
    end
  end

  def self.down
    if columns(:file_assets).collect {|c| c.name}.include?('width')
      remove_column :file_assets, :width
      remove_column :file_assets, :height
    end
  end
end
