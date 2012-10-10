class PriceComponentType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :pricing_plan_components
end
