require 'rails/generators'
require 'fileutils'

module ErpApp
	module Desktop
		module Scaffold
			class BaseController < ErpApp::Desktop::BaseController

			  def get_models
          names = ActiveRecord::Base.all_subclasses.collect{|klass| klass.name}.delete_if{|item| item =~ /::/}.uniq.sort{|a,b| a <=> b}

          respond_to do |format|
            format.json do
              render :json => {:success => true, :names => names.collect{|name| {:name => name}}}
            end
            format.tree do
              if params[:node].blank? || params[:node] == "root"
                render :json => {:success => true, :names => names.collect{|model| {:text => model, :id => model.underscore, :model => model, :iconCls => 'icon-grid', :leaf => false}}}
              else
                active_ext_core = ActiveExt::Core.new(params[:node].classify, :ignore_associations => true, :include_timestamps => false)
                non_excluded_columns = active_ext_core.non_excluded_columns.collect{|column| column.name}

                render :json => {:success => true, :names => non_excluded_columns.collect{|column| {:text => column, :iconCls => 'icon-gear', :leaf => true}}}
              end
            end
          end
        end

        def get_columns
          active_ext_core = ActiveExt::Core.new(params[:model], :ignore_associations => true, :include_timestamps => false)

          non_excluded_columns = active_ext_core.non_excluded_columns.collect{|column| {:name => column.name}}

          render :json => {:success => true, :columns => non_excluded_columns.sort{|a,b| a[:name] <=> b[:name]}}
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

        private

        def setup_active_ext_core
          model_id = params[:model_name]
          default_options = {
              :inline_edit => true,
              :use_ext_forms => false,
              :ignore_associations => true,
              :show_id => true,
              :show_timestamps => true,
              :only => nil
          }

          ActiveExt::Core.new(model_id, default_options)
        end

       end #BaseController
		end #Scaffold
	end #Desktop
end #ErpApp