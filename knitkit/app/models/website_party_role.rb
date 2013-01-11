class WebsitePartyRole < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :party
  belongs_to :website
  belongs_to :role_type
end
