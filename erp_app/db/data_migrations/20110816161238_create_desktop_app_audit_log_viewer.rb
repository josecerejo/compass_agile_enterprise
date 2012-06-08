class CreateDesktopAppAuditLogViewer
  def self.up
    app = DesktopApplication.create(
      :description => 'Audit Log Viewer',
      :icon => 'icon-history',
      :javascript_class_name => 'Compass.ErpApp.Desktop.Applications.AuditLogViewer',
      :internal_identifier => 'audit_log_viewer',
      :shortcut_id => 'audit_log_viewer-win'
    )

    app.preference_types << PreferenceType.iid('desktop_shortcut')
    app.preference_types << PreferenceType.iid('autoload_application')
    app.save

  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','audit_log_viewer'])
  end
end
