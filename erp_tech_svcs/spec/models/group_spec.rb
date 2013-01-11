require 'spec_helper'

describe Group do

  before(:all) do
    @group = Group.create(:description => "Test Group")
    @user = FactoryGirl.create(:user)
  end

  it "should allow you to add and remove roles" do
    role = SecurityRole.create(:description => "Test Role", :internal_identifier => 'test role')
    @group.has_role?(role).should eq false
    @group.add_role(role)
    @group.has_role?(role).should eq true
    @group.remove_role(role)
    @group.has_role?(role).should eq false
  end

  it "should allow you to add and remove capabilities" do
    c = FileAsset.add_capability('upload')
    @group.capabilities.include?(c).should eq false
    @group.add_capability(c)
    @group.capabilities.include?(c).should eq true
    @group.remove_capability(c)
    @group.capabilities.include?(c).should eq false
  end

  it "should allow you to add and remove users" do
    @group.users.include?(@user).should eq false
    @group.add_user(@user)
    @group.users.include?(@user).should eq true
    @group.remove_user(@user)
    @group.users.include?(@user).should eq false
  end

  after(:all) do
    User.destroy_all
    SecurityRole.destroy_all
  end

end