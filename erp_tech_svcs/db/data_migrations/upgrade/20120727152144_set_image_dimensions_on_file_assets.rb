class SetImageDimensionsOnFileAssets < ActiveRecord::Migration
  
  def self.up
    FileAsset.where(:type => 'Image').all.each do |i|
      i.save_dimensions
    end
  end
  
  def self.down
    # do nothing
  end

end
