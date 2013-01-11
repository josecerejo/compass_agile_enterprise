class PreferenceOption < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  has_many   :preferences
  has_and_belongs_to_many :preference_type

  def self.iid( internal_identifier )
    where('internal_identifier = ?', internal_identifier.to_s).first
  end
end
