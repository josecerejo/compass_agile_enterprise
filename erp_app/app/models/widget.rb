class Widget < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  has_and_belongs_to_many :applications
  has_many :user_preferences, :as => :preferenced_record

  validates_uniqueness_of :xtype, :case_sensitive => false
  validates_uniqueness_of :internal_identifier, :case_sensitive => false

end
