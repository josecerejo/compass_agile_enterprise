#require all ActionView helper files
Dir.entries(File.join(File.dirname(__FILE__),"helpers")).delete_if{|name| name =~ /^\./}.each do |file|
  require "rails_db_admin/extensions/railties/action_view/helpers/#{file}"
end

ActionView::Base.class_eval do
  include RailsDbAdmin::Extensions::Railties::ActionView::Helpers::ReportHelper
end