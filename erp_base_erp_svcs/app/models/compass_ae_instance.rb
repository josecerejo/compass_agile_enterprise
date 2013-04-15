require 'uuid'

class CompassAeInstance < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  has_tracked_status
  has_many :parties, :through => :compass_ae_instance_party_roles
  has_many :compass_ae_instance_party_roles, :dependent => :destroy do
    def owners
      where('role_type_id = ?', RoleType.compass_ae_instance_owner.id)
    end
  end
  validates :internal_identifier, :presence => {:message => 'internal_identifier cannot be blank'}, :uniqueness => {:case_sensitive => false}

  def installed_engines
    Rails.application.config.erp_base_erp_svcs.compass_ae_engines.map do |compass_ae_engine|
      klass_name = compass_ae_engine.railtie_name.camelize
      {:name => klass_name, :version => ("#{klass_name}::VERSION::STRING".constantize rescue 'N/A')}
    end
  end

  #helpers for guid
  def set_guid(guid)
    self.guid = guid
    self.save
  end

  def get_guid
    self.guid
  end

  def setup_guid
    set_guid(Digest::SHA1.hexdigest(Time.now.to_s + rand(10000).to_s))
  end

  def is_active? 
    self.type.nil? || self.current_status == 'deployed'
  end

  def activate
    self.current_status = 'deployed'
  end

  def deactivate
    self.current_status = 'undeployed'
  end
  
end