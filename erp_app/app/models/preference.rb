class Preference < ActiveRecord::Base
  attr_accessible :preference_type, :preference_option
  
  belongs_to :preference_type
  belongs_to :preference_option

end
