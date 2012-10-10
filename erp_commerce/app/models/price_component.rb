class PriceComponent < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :priced_component, :polymorphic => true
  belongs_to  :pricing_plan_component
  belongs_to  :price
  belongs_to  :money
  
end
