class CompassDriveAssetMailer < ActionMailer::Base
  default :from => 'website@tnsolutionsinc.com'

  def email_compass_drive_asset_version(to_email, compass_drive_asset_version)
    attachments[compass_drive_asset_version.compass_drive_asset.name] = compass_drive_asset_version.file_asset.get_contents

    mail(:to => to_email, :subject => 'CompassDriveAsset You Requested')
  end
end
