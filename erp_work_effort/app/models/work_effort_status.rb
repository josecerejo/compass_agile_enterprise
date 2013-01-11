class WorkEffortStatus < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :work_effort
  belongs_to :work_effort_status_type
end
