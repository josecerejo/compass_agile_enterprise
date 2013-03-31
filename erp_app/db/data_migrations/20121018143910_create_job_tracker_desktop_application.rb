class CreateJobTrackerDesktopApplication
  def self.up
    app = DesktopApplication.create(
      :description => 'Job Tracker',
      :icon => 'icon-calendar',
      :javascript_class_name => 'Compass.ErpApp.Desktop.Applications.JobTracker',
      :internal_identifier => 'job_tracker',
      :shortcut_id => 'job_tracker-win'
    )
    pt1 = PreferenceType.iid('desktop_shortcut')
    pt1.preferenced_records << app
    pt1.save

    pt2 = PreferenceType.iid('autoload_application')
    pt2.preferenced_records << app
    pt2.save
  end

  def self.down
    DesktopApplication.destroy_all(['internal_identifier = ?','job_tracker'])
  end
end
