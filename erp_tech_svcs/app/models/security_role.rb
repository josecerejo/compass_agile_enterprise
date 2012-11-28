class SecurityRole < ActiveRecord::Base
  acts_as_erp_type
  has_capability_accessors
  has_and_belongs_to_many :parties

  validates :description, :presence => {:message => 'Description cannot be blank'}
  validates :internal_identifier, :presence => {:message => 'Internal identifier cannot be blank'}
  validates_uniqueness_of :internal_identifier, :case_sensitive => false
  validates_length_of     :internal_identifier, :within => 3..100

	def to_xml(options = {})
		default_only = []
  	options[:only] = (options[:only] || []) + default_only
  	super(options)
  end

end
