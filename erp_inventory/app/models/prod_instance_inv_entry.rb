class ProdInstanceInvEntry < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :product_instance
  belongs_to :inventory_entry
  
end
