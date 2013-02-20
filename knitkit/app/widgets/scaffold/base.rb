module Widgets
  module Scaffold
    class Base < ErpApp::Widgets::Base
      def index
        @model = params[:model]
        @title = params[:grid][:title] || params[:model].pluralize
        @width = params[:grid][:width] || '100%'
        @height = params[:grid][:height] || 500
        @page = params[:grid][:page] || true
        @page_size = params[:grid][:page_size] || 10
        @display_msg = params[:grid][:display_msg] || 'Displaying {0} - {1} of {2}'
        @empty_msg = params[:grid][:empty_msg] || 'Empty'
        @editable = params[:grid][:editable] || false

        render :view => :index
      end

      def setup
        active_ext_core = setup_active_ext_core

        columns, fields, validations = ActiveExt::ExtHelpers::TableBuilder.generate_columns_and_fields(active_ext_core)
        result = {
            :success => true,
            :use_ext_forms => active_ext_core.options[:use_ext_forms].nil? ? false : active_ext_core.options[:use_ext_forms],
            :inline_edit => active_ext_core.options[:inline_edit].nil? ? false : active_ext_core.options[:inline_edit],
            :columns => columns,
            :fields => fields,
            :validations => validations
        }
        render :inline => result.to_json
      end

      def data
        active_ext_core = setup_active_ext_core

        json_text = nil

        if request.get?
          json_text = ActiveExt::ExtHelpers::DataHelper.build_json_data(active_ext_core, :limit => params[:limit], :offset => params[:start])
        elsif request.post?
          json_text = ActiveExt::ExtHelpers::DataHelper.create_record(active_ext_core, :data => params[:data])
        elsif request.put?
          json_text = ActiveExt::ExtHelpers::DataHelper.update_record(active_ext_core, :data => params[:data], :id => params[:data][:id])
        elsif request.delete?
          json_text = ActiveExt::ExtHelpers::DataHelper.delete_record(active_ext_core, :data => params[:data], :id => params[:data][:id])
        end

        render :inline => json_text
      end

      def setup_active_ext_core
        model_id = session[:widgets][self.uuid][:model].pluralize.singularize
        default_options = {
            :inline_edit => true,
            :use_ext_forms => false,
            :ignore_associations => true,
            :show_id => true,
            :show_timestamps => true,
            :only => nil
        }

        options = default_options.merge(session[:widgets][self.uuid][:scaffold])
        ActiveExt::Core.new(model_id,options)
      end
  
      #should not be modified
      #modify at your own risk
      def locate
        File.dirname(__FILE__)
      end
  
      class << self
        def title
          "CompassAE Scaffold"
        end
    
        def widget_name
          File.basename(File.dirname(__FILE__))
        end
      end
    end#Base
  end#Scaffold
end#Widgets
