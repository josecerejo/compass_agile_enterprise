class CompassAeInstance < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  has_tracked_status
  has_many :parties, :through => :compass_ae_instance_party_roles
  has_many :compass_ae_instance_party_roles, :dependent => :destroy
  validates :internal_identifier, :presence => {:message => 'internal_identifier cannot be blank'}, :uniqueness => {:case_sensitive => false}

  def installed_engines
    Rails.application.config.erp_base_erp_svcs.compass_ae_engines.map do |compass_ae_engine|
      klass_name = compass_ae_engine.railtie_name.camelize
      {:name => klass_name, :version => ("#{klass_name}::VERSION::STRING".constantize rescue 'N/A')}
    end
  end
  
end