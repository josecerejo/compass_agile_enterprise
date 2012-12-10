class AddDefaultCapabilities
  
  def self.up
    #CapabilityType.create(:internal_identifier => 'edit', :description => 'Edit')
    #CapabilityType.create(:internal_identifier => 'delete', :description => 'Delete')
    #CapabilityType.create(:internal_identifier => 'create', :description => 'Create')
    #CapabilityType.create(:internal_identifier => 'view', :description => 'View')

    admin = SecurityRole.find_by_internal_identifier('admin')
    employee = SecurityRole.find_by_internal_identifier('employee')

    #user_management_application = DesktopApplication.find_by_internal_identifier('user_management')
    #user_management_application.add_capability('create', 'User', 'admin')
    admin.add_capability('create', 'User')

   # user_management_application.add_capability('delete', 'User', 'admin')
    admin.add_capability('delete', 'User')

  #  notes_widget = Widget.find_by_internal_identifier('shared_notes_grid')
    #notes_widget.add_capability('create', 'Note', 'admin', 'employee')
    admin.add_capability('create', 'Note')
    employee.add_capability('create', 'Note')

    #notes_widget.add_capability('view', 'Note', 'admin', 'employee')
    admin.add_capability('view', 'Note')
    employee.add_capability('view', 'Note')

    #notes_widget.add_capability('delete', 'Note', 'admin')
    admin.add_capability('delete', 'Note')
  end
  
  def self.down
 #   CapabilityType.destroy_all("internal_identifier in (#{%w(edit,delete,create,view).map{|iid| "'#{iid}'"}.join(',')}")

 #   user_management_application = DesktopApplication.find_by_internal_identifier('user_management')
 #   user_management_application.remove_all_capabilities

 #  notes_widget = Widget.find_by_internal_identifier('shared_notes_grid')
 #   notes_widget.remove_all_capabilities
  end

end
