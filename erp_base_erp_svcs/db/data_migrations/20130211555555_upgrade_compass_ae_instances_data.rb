class UpgradeCompassAeInstancesData < ActiveRecord::Migration
  def self.up
    if CompassAeInstance.find_by_internal_identifier('base').nil?
      c = CompassAeInstance.order('id ASC').first
      c.description = 'Base CompassAE Instance'
      c.internal_identifier = 'base'
      c.schema = 'public'
      c.save
    end

    if RoleType.find_by_internal_identifier('compass_ae_instance_owner').nil?
      rt = RoleType.new
      rt.description = 'CompassAE Instance Owner'
      rt.internal_identifier = 'compass_ae_instance_owner'
      rt.save
    end
  end
end