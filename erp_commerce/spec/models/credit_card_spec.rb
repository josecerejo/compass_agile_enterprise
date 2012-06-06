require 'spec_helper'

describe CreditCard do
  it "can be instantiated" do
    CreditCard.new.should be_an_instance_of(CreditCard)
  end

  it "can be saved successfully" do
    CreditCard.create(
        :first_name_on_card => 'John',
        :last_name_on_card => 'Doe',
        :expiration_month => '12',
        :expiration_year => '2020',
        :crypted_private_card_number => '4444333322221111'
      ).should be_persisted
  end
end