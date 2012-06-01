module CompassDriveAssetError
  class CheckedOutBySomeoneElseError < Exception
    MESSAGE = "Checked out by someone else."
  end
end

class CompassDriveAsset < ActiveRecord::Base

  belongs_to :checked_out_by, :class_name => 'User', :foreign_key => 'checked_out_by_id'
  has_one :category_classification, :as => :classification, :dependent => :destroy
  has_many :compass_drive_asset_versions, :dependent => :destroy do
    def ordered
      order("created_at")
    end
  end

  def category
    self.category_classification.category unless self.category_classification.nil?
  end

  def categorize(category)
    CategoryClassification.create(:classification => self, :category => category)
  end

  def current_version
    self.compass_drive_asset_versions.ordered.last.version rescue 0
  end

  def checkout(user)
    self.checked_out = true
    self.last_checkout_at = Time.now
    self.checked_out_by = user
    self.save
    self.compass_drive_asset_versions.ordered.last
  end

  def checkin(user, data, comment)
    if self.checked_out
      raise CompassDriveAssetError::CheckedOutBySomeoneElseError, CompassDriveAssetError::CheckedOutBySomeoneElseError::MESSAGE unless (self.checked_out_by.id == user.id)
      self.add_file(data, comment)
      self.checked_out = false
      self.save
    end
  end

  def add_file(file, comment=nil, user=nil)
    compass_drive_asset_version = CompassDriveAssetVersion.new
    compass_drive_asset_version.version = (self.current_version + 1)
    compass_drive_asset_version.comment = comment
    compass_drive_asset_version.checked_in_by = user || self.checked_out_by
    compass_drive_asset_version.file_asset = FileAsset.create!(:base_path => file_path(compass_drive_asset_version.version), :data => file.read)
    compass_drive_asset_version.compass_drive_asset = self
    compass_drive_asset_version.save
  end

  def checked_out?
    self.checked_out
  end

  def file_path(version=nil)
    version = self.current_version if version.nil?
    File.join(root_path, basename, "#{(version)}.#{extname}")
  end

  def basename
    self.name.gsub(/\.#{extname}$/, "")
  end

  def extname
    File.extname(self.name).gsub(/^\.+/, '')
  end

  def root_path
    file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
    File.join(file_support.root, Rails.application.config.compass_drive.compass_drive_directory)
  end

  class << self

  end
end

