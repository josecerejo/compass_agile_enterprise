class InvoicePaymentTermSet < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :invoice
  has_many   :invoice_payment_terms

  alias :payment_terms :invoice_payment_terms
end
