module Knitkit
  module ErpApp
    module Desktop
      
      class ContentController < Knitkit::ErpApp::Desktop::AppController
        def update
          result = {:success => true}
          model = DesktopApplication.find_by_internal_identifier('knitkit')
          begin
            current_user.with_capability('edit_html', 'Content') do
              id      = params[:id]
              html    = params[:html]
              content = Content.find(id)
              content.body_html = html

              if content.save
                if params[:site_id]
                  website = Website.find(params[:site_id])
                  content.publish(website, 'Auto Publish', content.version, current_user) if website.publish_on_save?
                end
                #added for inline editing
                result[:last_update] = content.updated_at.strftime("%m/%d/%Y %I:%M%p")
              else
                result = {:success => false}
              end

              render :json => result
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def save_excerpt
          result = {:success => true}
          model = DesktopApplication.find_by_internal_identifier('knitkit')
          begin
            current_user.with_capability('edit_excerpt', 'Content') do
              id      = params[:id]
              html    = params[:html]
              content = Content.find(id)
              content.excerpt_html = html

              if content.save
                if params[:site_id]
                  website = Website.find(params[:site_id])
                  content.publish(website, 'Auto Publish', content.version, current_user) if website.publish_on_save?
                end
              else
                result = {:success => false}
              end

              render :json => result
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

      end#ContentController
    end#Desktop
  end#ErpApp
end#Knitkit
