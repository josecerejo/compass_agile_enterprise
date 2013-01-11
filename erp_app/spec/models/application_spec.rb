require 'spec_helper'

describe Application do
  it "can be instantiated" do
    Application.new.should be_an_instance_of(Application)
  end

  it "can be saved successfully" do
    Application.create(:javascript_class_name => 'test', :internal_identifier => 'test').should be_persisted
  end
end