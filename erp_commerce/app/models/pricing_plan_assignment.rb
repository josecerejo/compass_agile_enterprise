class PricingPlanAssignment < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to  :pricing_plan
  belongs_to  :priceable_item, :polymorphic => true
  
end
