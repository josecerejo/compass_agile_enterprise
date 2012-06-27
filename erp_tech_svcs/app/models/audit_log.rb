class AuditLog < ActiveRecord::Base

  validates :party_id, :presence => {:message => 'cannot be blank'}
  validates :description, :presence => {:message => 'cannot be blank'}
  validates :audit_log_type, :presence => {:message => 'cannot be blank'}

  belongs_to :audit_log_type
  belongs_to :party
  belongs_to :event_record, :polymorphic => true
  has_many   :audit_log_items, :dependent => :destroy

  alias :items :audit_log_items
  alias :type :audit_log_type

  def get_item_by_item_type_internal_identifier(item_type_internal_identifier)
    self.items.includes(:audit_log_item_type)
              .where(:audit_log_item_types => {:internal_identifier => item_type_internal_identifier}).first
  end

  #allow items to be looked up by method calls
  def respond_to?(m)
    (super ? true : get_item_by_item_type_internal_identifier(m.to_s)) rescue super
  end

  #allow items to be looked up by method calls
  def method_missing(m, *args, &block)
    if self.respond_to?(m)
      item = get_item_by_item_type_internal_identifier(m.to_s)
      (item.nil?) ? super : (return item.value)
    else
      super
    end
  end

  class << self
    def custom_application_log_message(party, msg)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','custom_message'),
        :description => "#{party.description}: #{msg}"
      )
    end

    def party_logout(party)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','successful_logout'),
        :description => "#{party.description} has logged out"
      )
    end

    def party_login(party)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','successful_login'),
        :description => "#{party.description} has logged in"
      )
    end

    def party_access(party, url)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','accessed_area'),
        :description => "#{party.description} has accessed area #{url}"
      )
    end

    def party_failed_access(party, url)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','accessed_area'),
        :description => "#{party.description} has tried to access a restricted area #{url}"
      )
    end

    def party_session_timeout(party)
      self.create(
        :party_id => party.id,
        :audit_log_type => AuditLogType.find_by_type_and_subtype_iid('application','session_timeout'),
        :description => "#{party.description} session has expired"
      )
    end
  end
end
