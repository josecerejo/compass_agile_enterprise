class WebsiteHost < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  protected_with_capabilities

  belongs_to :website
end
