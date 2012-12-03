class WebsiteHost < ActiveRecord::Base
  protected_by_capabilities

  belongs_to :website
end
