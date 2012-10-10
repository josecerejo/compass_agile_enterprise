class PhoneNumber < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_contact
  
	def summary_line
		"#{description} : #{phone_number}"
	end

  def eql_to?(phone)
    self.phone_number.reverse.gsub(/[^0-9]/,"")[0..9] == phone.reverse.gsub(/[^0-9]/,"")[0..9]
  end

	def to_label
		"#{description} : #{phone_number}"
	end

end
