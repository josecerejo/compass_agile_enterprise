class NoteCapabilities
  
  def self.up
    #insert data here
    admin = SecurityRole.find_or_create_by_description_and_internal_identifier(:description => 'Admin', :internal_identifier => 'admin')
    employee = SecurityRole.find_or_create_by_description_and_internal_identifier(:description => 'Employee', :internal_identifier => 'employee')

    admin.add_capability('create', 'Note')
    admin.add_capability('delete', 'Note')
    admin.add_capability('edit', 'Note')
    admin.add_capability('view', 'Note')

    employee.add_capability('create', 'Note')
    employee.add_capability('delete', 'Note')
    employee.add_capability('edit', 'Note')
    employee.add_capability('view', 'Note')
  end
  
  def self.down
    #remove data here
  end

end
