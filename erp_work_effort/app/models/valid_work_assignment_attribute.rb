class ValidWorkAssignmentAttribute < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :valid_work_assignment
end
