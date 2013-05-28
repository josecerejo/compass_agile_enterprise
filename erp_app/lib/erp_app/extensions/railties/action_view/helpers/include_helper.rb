module ErpApp
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module IncludeHelper

            def include_highslide(options = {})
              raw case options[:version].to_s.downcase
                    when 'full'
                      static_javascript_include_tag("erp_app/highslide/highslide/highslide-full.js")
                    when 'gallery'
                      static_javascript_include_tag("erp_app/highslide/highslide/highslide-with-gallery.js")
                    when 'html'
                      static_javascript_include_tag("erp_app/highslide/highslide/highslide-with-html.js")
                    else
                      static_javascript_include_tag("erp_app/highslide/highslide/highslide.js")
                  end
            end

            def setup_js_authentication(user, app_container)
              current_user = {
                  :username => user.username,
                  :lastloginAt => user.last_login_at,
                  :lastActivityAt => user.last_activity_at,
                  :failedLoginCount => user.failed_logins_count,
                  :email => user.email,
                  :roles => user.all_roles.collect { |role| role.internal_identifier },
                  :capabilities => user.class_capabilities_to_hash,
                  :id => user.id,
                  :description => user.party.to_s
              }
              js_string = static_javascript_include_tag('erp_app/authentication/compass_user.js')
              js_string << (raw "<script type='text/javascript'>var currentUser = new ErpApp.CompassAccessNegotiator.CompassUser(#{current_user.to_json});</script>")
              js_string
            end

            def include_code_mirror_library
              resources = static_javascript_include_tag("erp_app/codemirror/lib/codemirror.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/htmlmixed/htmlmixed.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/xml/xml.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/css/css.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/javascript/javascript.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/ruby/ruby.js")
              resources << static_javascript_include_tag("erp_app/codemirror/mode/yaml/yaml.js")
              resources << static_javascript_include_tag("erp_app/codemirror/lib/util/runmode.js")
              resources << static_javascript_include_tag("erp_app/codemirror_highlight.js")
              resources << (raw "<link rel=\"stylesheet\" type=\"text/css\" href=\"/javascripts/erp_app/codemirror/lib/codemirror.css\" />")
              resources
            end

            def include_compass_ae_instance_about
              compass_ae_instance = CompassAeInstance.find_by_internal_identifier('base')
              json_hash = {
                  :version => compass_ae_instance.version,
                  :installedAt => compass_ae_instance.created_at.strftime("%B %d, %Y at %I:%M%p"),
                  :lastUpdateAt => compass_ae_instance.updated_at.strftime("%B %d, %Y at %I:%M%p"),
                  :installedEngines => compass_ae_instance.installed_engines,
                  :guid => compass_ae_instance.guid
              }
              raw "<script type=\"text/javascript\">compassAeInstance = #{json_hash.to_json};</script>"
            end

            def setSessionTimeout(warn_milli_seconds=((ErpApp::Config.session_warn_after*60)*1000),
                redirect_milli_seconds=((ErpApp::Config.session_redirect_after*60)*1000),
                redirect_to='/session/sign_out')
              raw "<script type='text/javascript'>Compass.ErpApp.Utility.SessionTimeout.setupSessionTimeout(#{warn_milli_seconds}, #{redirect_milli_seconds}, '#{redirect_to}') </script>" if current_user
            end

            #need to remove camel case not rubyish
            alias_method :set_session_timeout, :setSessionTimeout

            def load_shared_application_resources(resource_type)
              resource_type = resource_type.to_sym
              case resource_type
                when :javascripts
                  raw static_javascript_include_tag(ErpApp::ApplicationResourceLoader::SharedLoader.new.locate_shared_files(resource_type))
                when :stylesheets
                  raw static_stylesheet_link_tag(ErpApp::ApplicationResourceLoader::SharedLoader.new.locate_shared_files(resource_type))
              end
            end

          end #IncludeHelper
        end #Helpers
      end #ActionView
    end #Railties
  end #Extensions
end #ErpApp