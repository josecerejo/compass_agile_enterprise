module Knitkit
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module KnitkitHelper

            def published_content_created_by
              "by #{@published_content.content.created_by.username}" rescue ''
            end

            def render_version_viewing
              html = ''

              if !session[:website_version].blank? && !session[:website_version].empty?
                site_version_hash = session[:website_version].find{|item| item[:website_id] == @website.id}
                unless site_version_hash.nil?
                  if site_version_hash[:version].to_f != @website.active_publication.version
                    html = "<div style='float:left;'>Viewing version #{site_version_hash[:version].to_f} <a href='/view_current_publication'>View current publication</a></div>"
                  end
                end
              end

              raw html
            end

            #options
            #nothing
            # - uses current page to lookup section and go up tree
            #menu
            # - menu to look for menu title in
            #menu_item
            # - title of menu_item to start breadcrumbs at
            #section_unique_name
            # - sections permalink to start breadcrumbs at
            def build_crumbs(options={})
              if options[:menu]
                menu = WebsiteNav.find_by_name(options[:menu])
                raise "Menu with name #{options[:menu]} does not exist" if menu.nil?
                menu_item = menu.website_nav_items.find(:first, :conditions => ["title = ?", options[:menu_item]])
                raise "Menu Item with Title #{options[:menu]} does not exist" if menu_item.nil?
                links = menu_item.self_and_ancestors.map{|child| {:url => child.path, :title => child.title}}
              elsif options[:section_unique_name]
                section = WebsiteSection.find_by_internal_identifier(options[:section_unique_name])
                raise "Website Section with that Internal ID does not exist" if section.nil?
                links = section.self_and_ancestors.map{|child| {:url => child.path, :title => child.title}}
              else
                links = @website_section.nil? ? [] : @website_section.self_and_ancestors.collect{|child| {:url => child.path, :title => child.title}}
              end

              render :partial => 'shared/knitkit/bread_crumb', :locals => {:links => links}
            end


            def tool_tip(message, img_src=nil)
              img_src = img_src || '/images/knitkit/tooltip.gif'
              raw "<a href='#' class='tooltip'>&nbsp;<img src='#{img_src}' alt='ToolTip' /><span>#{message}</span></a>"
            end

          end #KnitkitHelper
        end #Helpers
      end #ActionView
    end #Railties
  end #Extensions
end #Knitkit