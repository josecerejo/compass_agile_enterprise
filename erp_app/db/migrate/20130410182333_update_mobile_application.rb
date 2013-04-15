class UpdateMobileApplication < ActiveRecord::Migration
  def up
    unless columns(:applications).collect { |c| c.name }.include?('xtype')
      rename_column :applications, :base_url, :xtype

      user_management = MobileApplication.find_by_internal_identifier('user_management')
      if user_management.nil?
        MobileApplication.create(
            :description => 'User Mgmt',
            :icon => 'icon-user',
            :internal_identifier => 'user_management',
            :xtype => 'compass-erpapp-mobile-usermanagement-application'
        )
      else
        user_management.description = 'User Mgmt'
        user_management.xtype = 'compass-erpapp-mobile-usermanagement-application'
        user_management.save
      end
    end
  end

  def down
    if columns(:applications).collect { |c| c.name }.include?('xtype')
      rename_column :applications, :xtype, :base_url
    end
  end
end
