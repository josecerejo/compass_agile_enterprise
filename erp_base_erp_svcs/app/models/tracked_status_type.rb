class TrackedStatusType < ActiveRecord::Base
  attr_accessible :description, :internal_identifier

  has_many :status_applications

end