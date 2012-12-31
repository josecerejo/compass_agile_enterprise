class CreateSecurityManagementDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Security Management',
      :icon => 'icon-key',
      :javascript_class_name => 'Compass.ErpApp.Desktop.Applications.SecurityManagement',
      :internal_identifier => 'security_management',
      :shortcut_id => 'security_management-win'
    )
    pt1 = PreferenceType.iid('desktop_shortcut')
    pt1.preferenced_records << app
    pt1.save

    pt2 = PreferenceType.iid('autoload_application')
    pt2.preferenced_records << app
    pt2.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','security_management'])
  end
end
