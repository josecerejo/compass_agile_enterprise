class SetupCompassAeInstance
  
  def self.up
    c = CompassAeInstance.new
    c.description = 'Base CompassAE Instance'
    c.internal_identifier = 'base'
    c.version = '3.1'
    c.save

    rt = RoleType.new
    rt.description = 'CompassAE Instance Owner'
    rt.internal_identifier = 'compass_ae_instance_owner'
    rt.save
  end
  
  def self.down
    #remove data here
  end

end
