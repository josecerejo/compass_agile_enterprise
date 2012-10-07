class UserPreference < ActiveRecord::Base
  attr_accessible :user, :preference
  
  belongs_to :user
  belongs_to :preference
  belongs_to :preferenced_record, :polymorphic => true
end
