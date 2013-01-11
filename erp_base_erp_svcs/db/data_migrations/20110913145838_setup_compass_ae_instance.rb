class SetupCompassAeInstance
  
  def self.up
    CompassAeInstance.create(version: 3.1)
  end
  
  def self.down
    #remove data here
  end

end
