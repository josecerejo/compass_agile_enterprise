class InvoicePaymentTerm < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_one    :invoice_payment_term_type
  belongs_to :invoice_payment_term_set
end
