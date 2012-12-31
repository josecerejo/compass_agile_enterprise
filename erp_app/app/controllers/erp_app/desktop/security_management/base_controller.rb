module ErpApp
  module Desktop
    module SecurityManagement
      class BaseController < ::ErpApp::Desktop::BaseController
      
        # used for related_searchbox
        def search
          if params[:model].blank? or (params[:displayField].blank? and params[:search_fields].blank?)
            render :inline => '[]'
          else
            related_model = params[:model].camelize.constantize
            query = related_model

            unless params[:search_fields].blank?
              #related_searchbox
              search_fields = params[:search_fields].split(',')
              unless params[:query].blank?
                sql = ''
                search_fields.each_with_index do |f,i|
                  sql += " OR " if i > 0
                  sql += "UPPER(#{f}) LIKE UPPER('%#{params[:query]}%')"
                end
                query = query.where(sql)
              end
              query = query.paginate(:page => page, :per_page => per_page)
            end

            total = query.count
            data = query.all
            render :inline => { :data => data, :total => total}.to_json
          end
        end

        protected
        def page
          offset = params[:start].to_f
          offset > 0 ? (offset / params[:limit].to_f).to_i + 1 : 1
        end
        
        def per_page
          params[:limit].nil? ? 10 : params[:limit].to_i
        end

      end
    end#SecurityManagement
  end#Desktop
end#ErpApp