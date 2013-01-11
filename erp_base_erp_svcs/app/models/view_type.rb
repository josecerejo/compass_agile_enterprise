class ViewType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :descriptive_assets
end
