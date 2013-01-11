class ContactType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
end
