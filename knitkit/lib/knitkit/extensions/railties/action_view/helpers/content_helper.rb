module Knitkit
  module Extensions
    module Railties
      module ActionView
        module Helpers
          module ContentHelper

            def setup_inline_editing
              model = DesktopApplication.find_by_internal_identifier('knitkit')
              unless (current_user === false)
                if current_user.has_capability?(model, 'edit_html', 'Article')
                  raw "<script type='text/javascript'>
                      jQuery(document).ready(function() {
                          Knitkit.InlineEditing.setup(#{@website.id});
                      });
                    </script>"
                end
              end
            end

            def render_editable_content(content_version, additional_css_classes=[])
              raw "<div class='knitkit_content #{additional_css_classes.join(' ')}'
                        contentid='#{content_version.content.id}'
                        lastupdate='#{content_version.content.updated_at.strftime("%m/%d/%Y %I:%M%p")}'>#{content_version.body_html}</div>"
            end

            # render a piece of content by internal identifier regardless if it belongs to a section or not
            def render_content(iid)
              content = Content.find_by_internal_identifier(iid)
              content_version = Content.get_published_version(@active_publication, content) unless @active_publication.nil?
              content_version = content if @active_publication.nil? or content_version.nil?

              if content_version.nil?
                ''
              else
                raw "<div class='knitkit_content'
                        content_id='#{content.id}'
                        lastupdate='#{content_version.content.updated_at.strftime("%m/%d/%Y %I:%M%p")}'>
                        #{(content_version.body_html.nil? ? '' : content_version.body_html)}</div>"
              end
            end

            def render_content_area(name)
              html = ''

              section_contents = WebsiteSectionContent.include(:content).where(:website_section_id => @website_section.id, :content_area => name.to_s).order(:position)
              published_contents = []
              section_contents.each do |sc|
                content_version = Content.get_published_version(@active_publication, sc.content)
                published_contents << content_version unless content_version.nil?
              end

              published_contents.each do |content|
                body_html = content.body_html.nil? ? '' : content.body_html
                html << body_html
              end

              raw html
            end

          end #ContentHelper
        end #Helpers
      end #ActionView
    end #Railties
  end #Extensions
end #Knitkit