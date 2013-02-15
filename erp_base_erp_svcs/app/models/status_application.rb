class StatusApplication < ActiveRecord::Base
  belongs_to :tracked_status_type
  belongs_to :status_application_record, :polymorphic => true

end