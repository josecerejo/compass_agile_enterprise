module Knitkit
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module BlogHelper

            def blog_add_comment_form
              render :partial => 'add_comment' if current_user
            end

            def blog_topics(css_class='tag_link')
              html = ''

              @website_section.get_topics.each do |tag|
                html += '<div class="'+css_class+'">'
                html += link_to(tag.name, main_app.blog_tag_path(@website_section.id, tag.id))
                html += '</div>'
              end

              raw html
            end

            def blog_rss_links(link_title='RSS Feed')
              if params[:action] == 'tag'
                return link_to link_title, main_app.blog_tag_url(params[:section_id], params[:tag_id], :rss), :target => '_blank'
              else
                return link_to link_title, main_app.blogs_url(params[:section_id], :rss), :target => '_blank'
              end
            end

            def blog_recent_approved_comments
              if @published_content.content.comments.recent.approved.empty?
                return 'No Comments'
              else
                html = ''

                @published_content.content.comments.recent.approved.each do |comment|
                  html += render :partial => 'comment', :locals => {:comment => comment}
                end

                return raw html
              end
            end

            def blog_pagination(css_class, params)
              return will_paginate @contents, :class => css_class, :params => {
                  :section_id => params[:section_id],
                  :per_page => params[:per_page],
                  :format => params[:format],
                  :only_path => true,
                  :use_route => params[:use_route],
                  :scope => main_app
              }
            end

          end #BlogHelper
        end #Helpers
      end #ActionView
    end #Railties
  end #Extensions
end #Knitkit