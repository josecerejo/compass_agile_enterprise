class AddDefaultCapabilities
  
  def self.up
    admin = SecurityRole.find_by_internal_identifier('admin')
    employee = SecurityRole.find_by_internal_identifier('employee')

    admin.add_capability('create', 'User')
    admin.add_capability('delete', 'User')

    admin.add_capability('create', 'Note')
    employee.add_capability('create', 'Note')

    admin.add_capability('view', 'Note')
    employee.add_capability('view', 'Note')

    admin.add_capability('delete', 'Note')
  end
  
  def self.down
  end

end
