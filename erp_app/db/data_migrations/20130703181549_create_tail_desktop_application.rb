class CreateTailDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Tail',
      :icon => 'icon-document_pulse',
      :javascript_class_name => 'Compass.ErpApp.Desktop.Applications.Tail',
      :internal_identifier => 'tail',
      :shortcut_id => 'tail-win'
    )
    pt1 = PreferenceType.iid('desktop_shortcut')
    pt1.preferenced_records << app
    pt1.save

    pt2 = PreferenceType.iid('autoload_application')
    pt2.preferenced_records << app
    pt2.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','tail'])
  end
end
