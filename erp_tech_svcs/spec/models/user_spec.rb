require 'spec_helper'

describe User do

  before(:all) do
    @user = FactoryGirl.create(:user)
  end

  it "should allow you to add and remove roles" do
    role = SecurityRole.create(:description => "Test Role", :internal_identifier => 'test role')
    @user.has_role?(role).should eq false
    @user.add_role(role)
    @user.has_role?(role).should eq true
    @user.remove_role(role)
    @user.has_role?(role).should eq false
  end

  it "should allow you to add and remove capabilities" do
    c = FileAsset.add_capability('upload')
    @user.has_capability?('upload','FileAsset').should eq false
    @user.add_capability(c)
    @user.has_capability?('upload','FileAsset').should eq true
    @user.remove_capability(c)
    @user.has_capability?('upload','FileAsset').should eq false
  end

  it "should allow you to add instance attributes" do
    @user.add_instance_attribute(:test, 'result')
    @user.instance_attributes[:test].should eq 'result'
  end

  after(:all) do
    User.destroy_all
    SecurityRole.destroy_all
  end

end