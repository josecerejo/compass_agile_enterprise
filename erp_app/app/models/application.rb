class Application < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  has_user_preferences

  has_and_belongs_to_many :app_containers
  has_and_belongs_to_many :widgets

  validates_uniqueness_of :javascript_class_name, :allow_nil => true
  validates_uniqueness_of :internal_identifier, :scope => :type, :case_sensitive => false

  def locate_resources(resource_type)
    resource_loader = ErpApp::ApplicationResourceLoader::DesktopOrganizerLoader.new(self)
    resource_loader.locate_resources(resource_type)
  end
  
end
