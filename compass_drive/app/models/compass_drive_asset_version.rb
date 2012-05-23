class CompassDriveAssetVersion < ActiveRecord::Base
  belongs_to :file_asset, :dependent => :destroy
  belongs_to :compass_drive_asset
  belongs_to :checked_in_by, :class_name => 'User', :foreign_key => 'checked_in_by_id'

  def file_path
    File.join(self.compass_drive_asset.root_path, self.compass_drive_asset.basename, "#{(version)}.#{self.compass_drive_asset.extname}")
  end
end

