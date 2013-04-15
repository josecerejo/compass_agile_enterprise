class CreateUserManagementMobileApplication

  def self.up
    MobileApplication.create(
        :description => 'User Management',
        :icon => 'icon-user',
        :internal_identifier => 'user_management',
        :base_url => '/erp_app/mobile/user_management/index'
    )
  end

  def self.down
    MobileApplication.destroy_all("internal_identifier = 'user_management'")
  end

end