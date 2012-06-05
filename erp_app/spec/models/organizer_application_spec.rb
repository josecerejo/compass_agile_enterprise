require 'spec_helper'

describe OrganizerApplication do
  it "can be instantiated" do
    OrganizerApplication.new.should be_an_instance_of(OrganizerApplication)
  end

  it "can be saved successfully" do
    OrganizerApplication.create(:javascript_class_name => 'test', :internal_identifier => 'test').should be_persisted
  end
end