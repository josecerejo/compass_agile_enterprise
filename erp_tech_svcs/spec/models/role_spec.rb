require 'spec_helper'

describe Role do

  before(:all) do
    @role = SecurityRole.create(:internal_identifier => 'employee')
  end

  it "can transform into xml" do
    @role.to_xml
  end

  after(:all) do
    SecurityRole.destroy_all
  end

end