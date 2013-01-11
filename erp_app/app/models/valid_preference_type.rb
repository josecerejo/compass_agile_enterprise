class ValidPreferenceType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :preference_type
  belongs_to :preferenced_record, :polymorphic => true
end
