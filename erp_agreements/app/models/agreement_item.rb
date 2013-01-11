class AgreementItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

	belongs_to 	:agreement
	belongs_to	:agreement_item_type
end
