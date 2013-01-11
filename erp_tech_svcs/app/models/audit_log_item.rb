class AuditLogItem < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :audit_log_item_type
  belongs_to :audit_log

  alias :type  :audit_log_item_type
end
