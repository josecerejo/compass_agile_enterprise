class CreateUserManagementMobileApplication

  def self.up
    MobileApplication.create(
        :description => 'User Management',
        :icon => 'icon-user',
        :internal_identifier => 'user_management',
        :xtype => 'compass-erpapp-mobile-usermanagement-application'
    )
  end

  def self.down
    MobileApplication.destroy_all("internal_identifier = 'user_management'")
  end

end