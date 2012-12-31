class CreateCapabilityScopeTypes
  
  def self.up
    CapabilityType.create(:internal_identifier => 'download', :description => 'Download') if CapabilityType.where("internal_identifier = 'download'").first.nil?

    ScopeType.create(:description => 'Instance', :internal_identifier => 'instance') if ScopeType.where("internal_identifier = 'instance'").first.nil?
    ScopeType.create(:description => 'Class', :internal_identifier => 'class') if ScopeType.where("internal_identifier = 'class'").first.nil?
    ScopeType.create(:description => 'Query', :internal_identifier => 'query') if ScopeType.where("internal_identifier = 'query'").first.nil?
  end
  
  def self.down
  end

end
