class ValidPreferenceType < ActiveRecord::Base
  attr_accessible :preference_type_id, :preferenced_record_type, :preferenced_record_id

  belongs_to :preference_type
  belongs_to :preferenced_record, :polymorphic => true
end
