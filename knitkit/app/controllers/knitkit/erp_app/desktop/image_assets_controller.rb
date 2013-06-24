module Knitkit
  module ErpApp
    module Desktop
      class ImageAssetsController < FileAssetsController
        
        def get_images
          directory = (params[:directory] == 'root_node' or params[:directory].blank?) ? base_path : params[:directory]
          # this @assets_model.images.select should be refactored into a query
          render :json => @assets_model.images.select{|image| image.directory == directory.sub(@file_support.root,'')}.collect{|image|{:name => image.name, :shortName => image.name[0..15], :url => image.data.url}}
        end

        def upload_file
          #Website level assets if allowed to be viewed can also be uploaded and deleted so this is only checking for the view capability
          if @context == Website
            capability_type = "view"
            capability_resource = "SiteImageAsset"
          else
            capability_type = "upload"
            capability_resource = "GlobalImageAsset"
          end

          model = DesktopApplication.find_by_internal_identifier('knitkit')
          begin
            current_user.with_capability(capability_type, capability_resource) do
              result = {}
              upload_path = params[:directory]
              name = params[:name]
              data = request.raw_post

              begin
                upload_path == 'root_node' ? @assets_model.add_file(data, File.join(base_path,name)) : @assets_model.add_file(data, File.join(@file_support.root,upload_path,name))
                result = {:success => true}
              rescue Exception=>ex
                logger.error ex.message
                logger.error ex.backtrace.join("\n")
                result = {:success => false, :error => "Error uploading file."}
              end

              #the awesome uploader widget whats this to mime type text, leave it render :inline
              render :inline => result.to_json
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        def delete_file
          messages = []

          if @context == Website
            capability_type = "view"
            capability_resource = "SiteImageAsset"
          else
            capability_type = "delete"
            capability_resource = "GlobalImageAsset"
          end

          nodes_to_delete = (params[:selected_nodes] ? JSON(params[:selected_nodes]) : [params[:node]])

          model = DesktopApplication.find_by_internal_identifier('knitkit')
          begin
            result = false
            nodes_to_delete.each do |path|
              current_user.with_capability(capability_type, capability_resource) do
                path = "#{path}/" if params[:leaf] == 'false' and path.match(/\/$/).nil?
                begin
                  name = File.basename(path)
                  result, message, is_folder = @file_support.delete_file(File.join(@file_support.root,path))
                  if result and !is_folder
                    file = @assets_model.files.find(:first, :conditions => ['name = ? and directory = ?', ::File.basename(path), ::File.dirname(path)])
                    file.destroy
                  end
                  messages << message
                rescue Exception=>ex
                  Rails.logger.error ex.message
                  Rails.logger.error ex.backtrace.join("\n")
                  render :json => {:success => false, :error => "Error deleting #{name}"} and return
                end
              end # end current_user.with_capability
            end # end nodes_to_delete.each
            if result
              render :json => {:success => true, :message => messages.join(',')}
            else
              render :json => {:success => false, :error => messages.join(',')}
            end
          rescue ErpTechSvcs::Utils::CompassAccessNegotiator::Errors::UserDoesNotHaveCapability=>ex
            render :json => {:success => false, :message => ex.message}
          end
        end

        protected

        def set_root_node
          @root_node = nil

          if @context == :website
            @root_node = File.join(Rails.application.config.knitkit.images_path, "sites", @assets_model.iid, "images") unless @assets_model.nil?
          else
            @root_node = File.join(Rails.application.config.knitkit.images_base_path, 'images')
          end

          @root_node
        end

        def set_file_support
          @file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
        end
        
      end#ImageAssetsController
    end#Desktop
  end#ErpApp
end#Knitkit
