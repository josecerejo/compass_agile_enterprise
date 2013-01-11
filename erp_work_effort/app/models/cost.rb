class Cost < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :money
end
