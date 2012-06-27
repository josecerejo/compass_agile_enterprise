class AuditLogItem < ActiveRecord::Base
  belongs_to :audit_log_item_type
  belongs_to :audit_log

  alias :value :audit_log_item_value
  alias :type  :audit_log_item_type
end
