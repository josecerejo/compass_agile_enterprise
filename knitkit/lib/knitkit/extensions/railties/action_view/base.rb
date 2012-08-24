#require all ActionView helper files
Dir.entries(File.join(File.dirname(__FILE__),"helpers")).delete_if{|name| name =~ /^\./}.each do |file|
  require "knitkit/extensions/railties/action_view/helpers/#{file}"
end

ActionView::Base.class_eval do
  include Knitkit::Extensions::Railties::ActionView::Helpers::BlogHelper
  include Knitkit::Extensions::Railties::ActionView::Helpers::ContentHelper
  include Knitkit::Extensions::Railties::ActionView::Helpers::MenuHelper
  include Knitkit::Extensions::Railties::ActionView::Helpers::KnitkitHelper
end