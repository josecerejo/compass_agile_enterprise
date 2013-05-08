module Knitkit
  module ErpApp
    module Desktop
      class WebsiteSectionController < Knitkit::ErpApp::Desktop::AppController
        before_filter :set_website_section, :only => [:detach_article, :update, :update_security, :add_layout, :get_layout, :save_layout]

        def new
          begin
            current_user.with_capability('create', 'WebsiteSection') do
              website = Website.find(params[:website_id])

              if params[:title].to_s.downcase == 'blog' && params[:type] == 'Blog'
                result = {:success => false, :message => 'Blog can not be the title of a Blog'}
              else
                website_section = WebsiteSection.new
                website_section.website_id = website.id
                website_section.in_menu = params[:in_menu] == 'yes'
                website_section.title = params[:title]
                website_section.render_base_layout = params[:render_with_base_layout] == 'yes'
                website_section.type = params[:type] unless params[:type] == 'Page'
                website_section.internal_identifier = params[:internal_identifier]
                website_section.position = 0 # explicitly set position null, MS SQL doesn't always honor column default

                if website_section.save
                  if params[:website_section_id]
                    parent_website_section = WebsiteSection.find(params[:website_section_id])
                    website_section.move_to_child_of(parent_website_section)
                  end

                  if params[:type] == "OnlineDocumentSection"
                    documented_content = DocumentedContent.create(:title => website_section.title, :created_by => current_user, :body_html => website_section.title)
                    DocumentedItem.create(:documented_content_id => documented_content.id, :online_document_section_id => website_section.id)
                  end

                  website_section.update_path!
                  result = {:success => true, :node => build_section_hash(website_section, website_section.website)}
                else
                  message = "<ul>"
                  website_section.errors.collect do |e, m|
                    message << "<li>#{e} #{m}</li>"
                  end
                  message << "</ul>"
                  result = {:success => false, :message => message}
                end

              end

              render :json => result
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def delete
          begin
            current_user.with_capability('delete', 'WebsiteSection') do
              render :json => WebsiteSection.destroy(params[:id]) ? {:success => true} : {:success => false}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def detach_article
          success = WebsiteSectionContent.where(:website_section_id => @website_section.id, :content_id => params[:article_id]).first.destroy
          render :json => success ? {:success => true} : {:success => false}
        end

        def update_security
          if current_user.has_capability?('secure', 'WebsiteSection') or current_user.has_capability?('unsecure', 'WebsiteSection')
            roles = []

            #get roles
            params.each do |k, v|
              if v == 'on'
                roles.push(k)
              end
            end

            if roles.empty?
              @website_section.remove_capability(:view)
            else
              capability = @website_section.add_capability(:view)
              capability.remove_all_roles
              roles.each do |r|
                role = SecurityRole.find_by_internal_identifier(r)
                role.add_capability(capability)
              end
            end

            render :json => {:success => true, :secured => @website_section.is_secured?, :roles => @website_section.roles.collect{|item| item.internal_identifier}}
          else
            render :json => {:success => false, :message => "User does not have capability."}
          end
        end

        def update
          begin
            current_user.with_capability('edit', 'WebsiteSection') do
              @website_section.in_menu = params[:in_menu] == 'yes'
              @website_section.title = params[:title]
              @website_section.render_base_layout = params[:render_with_base_layout] == 'yes'
              @website_section.internal_identifier = params[:internal_identifier]


              #check if this is a OnlineDocumentSection if so set markdown
              if @website_section.is_a?(OnlineDocumentSection) || @website_section.type == 'OnlineDocumentSection'
                @website_section.use_markdown = (params[:use_markdown] == 'yes')
              end

              website = @website_section.website
              if @website_section.save
                @website_section.publish(website, 'Auto Publish', @website_section.version, current_user) if website.publish_on_save?

                render :json => {:success => true}
              else
                render :json => {:success => false}
              end
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def add_layout
          begin
            current_user.with_capability('create', 'WebsiteSectionLayout') do
              @website_section.create_layout
              render :json => {:success => true}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def get_layout
          begin
            current_user.with_capability('edit', 'WebsiteSectionLayout') do
              render :text => @website_section.layout
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def save_layout
          begin
            current_user.with_capability('edit', 'WebsiteSectionLayout') do
              result = Knitkit::SyntaxValidator.validate_content(:erb, params[:content])
              unless result
                website = @website_section.website
                @website_section.layout = params[:content]
                saved = @website_section.save
                @website_section.publish(website, 'Auto Publish', @website_section.version, current_user) if saved and website.publish_on_save?
                render :json => saved ? {:success => true} : {:success => false}
              else
                render :json => {:success => false, :message => result}
              end
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability => ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def available_articles_filter
          menu = []
          websites = Website.all
          all_articles = [{:name => 'All Articles', :id => 0}]
          orphaned_articles = [{:name => 'Orphaned Articles Only', :id => -1}]

          websites_array = []
          websites.each do |w|
            websites_array << {:name => "Website: #{w.name}", :id => w.id}
          end

          menu = all_articles + orphaned_articles + websites_array

          render :inline => "{\"websites\":#{menu.to_json(:only => [:name, :id])}}"
        end

        def available_articles
          website_id = params[:website_id]
          current_articles = Article.joins(:website_section_contents).where("website_section_id = #{params[:section_id]}").all

          # Defaults to retrieving all articles
          available_articles = Article.order('LOWER(contents.internal_identifier) ASC')

          # Orphaned Articles
          if !website_id.blank? and website_id.to_i == -1
            available_articles = available_articles.includes(:website_section_contents).where(:website_section_contents => {:content_id => nil})
          end

          # Website Articles
          if !website_id.blank? and website_id.to_i > 0
            available_articles = available_articles.joins(:website_sections).where("website_sections.website_id = #{website_id}")
          end

          available_articles = available_articles.all - current_articles

          render :inline => "{\"articles\":#{available_articles.to_json(:only => [:title, :internal_identifier, :id], :methods => [:combobox_display_value])}}"
        end

        def existing_sections
          website = Website.find(params[:website_id])
          WebsiteSection.class_eval do
            def title_permalink
              "#{self.title} - #{self.path}"
            end
          end
          render :inline => website.sections.to_json(:only => [:id], :methods => [:title_permalink])
        end

        protected

        def set_website_section
          @website_section = WebsiteSection.find(params[:id])
        end

      end #WebsiteSectionController
    end #Desktop
  end #ErpApp
end #Knitkit
