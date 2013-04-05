class AddGuidToInstances
  
  def self.up
    CompassAeInstance.all.each do |instance|
      instance.setup_guid
      instance.activate
    end
  end

end
