class InvoicePaymentTermType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :invoice_payment_terms
end
