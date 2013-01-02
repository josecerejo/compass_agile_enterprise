class UpgradeRemoveSystemMgmtApp
  
  def self.up
    #insert data here
    widget = Widget.find_by_xtype('systemmanagement_applicationrolemanagment')
    widget.destroy unless widget.nil?
    app = Application.find_by_internal_identifier('system_management')
    app.destroy unless app.nil?
  end
  
  def self.down
    #remove data here
  end

end
