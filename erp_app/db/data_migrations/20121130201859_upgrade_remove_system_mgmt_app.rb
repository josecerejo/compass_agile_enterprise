class UpgradeRemoveSystemMgmtApp
  
  def self.up
    #insert data here
    Widget.find_by_xtype('systemmanagement_applicationrolemanagment').destroy
    Application.find_by_internal_identifier('system_management').destroy
  end
  
  def self.down
    #remove data here
  end

end
