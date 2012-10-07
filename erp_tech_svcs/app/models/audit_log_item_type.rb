class AuditLogItemType < ActiveRecord::Base
  attr_accessible :description, :internal_identifier
  
  acts_as_nested_set
  acts_as_erp_type

  has_many :audit_log_items
end
