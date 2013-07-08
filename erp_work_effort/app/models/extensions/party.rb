Party.class_eval do
  has_many :resource_availabilities, :class_name => 'PartyResourceAvailability', :dependent => :destroy
  has_many :assigned_to_work_efforts, :as => 'assigned_to', :class_name => 'WorkEffortAssignment', :dependent => :destroy
  has_many :assigned_by_work_efforts, :as => 'assigned_by', :class_name => 'WorkEffortAssignment', :dependent => :destroy
end
