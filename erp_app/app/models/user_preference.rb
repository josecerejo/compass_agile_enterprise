class UserPreference < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  belongs_to :user
  belongs_to :preference
  belongs_to :preferenced_record, :polymorphic => true
end
