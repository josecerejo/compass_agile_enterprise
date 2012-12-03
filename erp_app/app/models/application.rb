class Application < ActiveRecord::Base
  has_user_preferences

  has_and_belongs_to_many :app_containers
  has_and_belongs_to_many :widgets

  validates_uniqueness_of :javascript_class_name
  validates_uniqueness_of :internal_identifier, :scope => :type

  def locate_resources(resource_type)
    resource_loader = ErpApp::ApplicationResourceLoader::DesktopOrganizerLoader.new(self)
    resource_loader.locate_resources(resource_type)
  end
  
end
