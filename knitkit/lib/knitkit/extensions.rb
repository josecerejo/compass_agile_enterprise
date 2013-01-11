#core ruby extensions
require 'knitkit/extensions/core/array'

#railties
require 'knitkit/extensions/railties/action_view/base'
require 'knitkit/extensions/railties/theme_support/asset_tag_helper'
require 'knitkit/extensions/railties/theme_support/theme_file_resolver'

#active_record extensions
require 'knitkit/extensions/active_record/acts_as_publishable'
require 'knitkit/extensions/active_record/theme_support/has_many_themes'
require 'knitkit/extensions/active_record/acts_as_document'

#active_controller extensions
require 'knitkit/extensions/action_controller/theme_support/acts_as_themed_controller'

#action_mailer extensions
require 'knitkit/extensions/action_mailer/theme_support/acts_as_themed_mailer'
