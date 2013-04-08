class AddGuidToInstances
  
  def self.up
    CompassAeInstance.all.each do |instance|
      instance.setup_guid
    end
  end

end
