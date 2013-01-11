require 'spec_helper'

describe SecurityRole do

  before(:all) do
    @role = SecurityRole.create(:description => "Test Role", :internal_identifier => 'test role')
  end

  it "should allow you to add and remove capabilities" do
    c = FileAsset.add_capability('upload')
    @role.capabilities.include?(c).should eq false
    @role.add_capability(c)
    @role.capabilities.include?(c).should eq true
    @role.remove_capability(c)
    @role.capabilities.include?(c).should eq false
  end

  it "can transform into xml" do
    @role.to_xml
  end

  after(:all) do
    SecurityRole.destroy_all
  end

end