class PaymentGateway < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :payment_gateway_action
  belongs_to :payment
end
