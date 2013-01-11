class ValidPricePlanComponent < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  #cross-reference table that allows the association of pricing plan components
  #to multiple pricing plans
  belongs_to  :pricing_plan
  belongs_to  :pricing_plan_component

end
