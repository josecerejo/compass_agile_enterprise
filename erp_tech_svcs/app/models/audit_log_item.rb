class AuditLogItem < ActiveRecord::Base
  belongs_to :audit_log_item_type
  belongs_to :audit_log

  alias :type  :audit_log_item_type
end
