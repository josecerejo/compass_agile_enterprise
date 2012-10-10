class ValidWorkAssignment < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :party
  belongs_to :work_requirement
  belongs_to :role_type
  has_many   :valid_work_assignment_attributes, :dependent => :destroy

  alias :attributes :valid_work_assignment_attributes
end
