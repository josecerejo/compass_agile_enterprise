class WebsiteHost < ActiveRecord::Base
  protected_with_capabilities

  belongs_to :website
end
