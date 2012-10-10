class PricePlanCompGlAccount < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :pricing_plan_component
  belongs_to :gl_account
end
