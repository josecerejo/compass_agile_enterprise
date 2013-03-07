module Widgets
  module DynamicGrid
    class Base < ErpApp::Widgets::Base
  
      def index
        @model_name = params[:model_name]
        @title = params[:grid][:title] || params[:model].pluralize
        @width = params[:grid][:width] || '100%'
        @height = params[:grid][:height] || 500
        @page = params[:grid][:page] || true
        @page_size = params[:grid][:page_size] || 10
        @display_msg = params[:grid][:display_msg] || 'Displaying {0} - {1} of {2}'
        @empty_msg = params[:grid][:empty_msg] || 'Empty'

        render :view => :index
      end
      
      def setup
        begin
          form = DynamicForm.get_form(params[:model_name]) 
          raise "No Default Form found for this model." if form.nil?   
          definition = form.definition_object

          columns = []
          definition.each do |field_hash|
            if field_hash[:display_in_grid]
              # for some reason grid column widths are greater than form field widths
              field_hash[:width] = (field_hash[:width].to_f * 0.56).round.to_i unless field_hash[:width].nil?
              columns << DynamicGridColumn.build_column(field_hash)
            end
          end

          columns << DynamicGridColumn.build_column({ :fieldLabel => "Created By", :name => 'created_username', :xtype => 'textfield', :width => 100 })
          columns << DynamicGridColumn.build_column({ :fieldLabel => "Created At", :name => 'created_at', :xtype => 'datefield', :width => 115 })
          columns << DynamicGridColumn.build_column({ :fieldLabel => "Updated By", :name => 'updated_username', :xtype => 'textfield', :width => 100 })
          columns << DynamicGridColumn.build_column({ :fieldLabel => "Updated At", :name => 'updated_at', :xtype => 'datefield', :width => 115 })

          definition << DynamicFormField.textfield({ :fieldLabel => "Created By", :name => 'created_username' })
          definition << DynamicFormField.datefield({ :fieldLabel => "Created At", :name => 'created_at' })
          definition << DynamicFormField.textfield({ :fieldLabel => "Updated By", :name => 'updated_username' })
          definition << DynamicFormField.datefield({ :fieldLabel => "Updated At", :name => 'updated_at' })
          definition << DynamicFormField.hiddenfield({ :fieldLabel => "ID", :name => 'id' })
          definition << DynamicFormField.hiddenfield({ :fieldLabel => "Form ID", :name => 'form_id' })
          definition << DynamicFormField.hiddenfield({ :fieldLabel => "Model Name", :name => 'model_name' })

          render :inline => "{
          \"success\": true,
          \"use_ext_forms\":false,
          \"inline_edit\":false,
          \"columns\": [#{columns.join(',')}],
          \"fields\": #{definition.to_json}
          }"

        rescue Exception => e
          Rails.logger.error e.message
          Rails.logger.error e.backtrace.join("\n")
          render :inline => {
            :success => false,
            :message => e.message
          }.to_json             
        end
      end
      
      def data
        begin
          sort  = (params[:sort] || 'created_at').downcase
          dir   = (params[:dir] || 'desc').downcase
          page = params[:page]
          per_page = params[:per_page]
               
          query_filter = params[:query_filter].strip rescue nil

          myDynamicObject = DynamicFormModel.get_constant(params[:model_name])

          if $USE_SOLR_FOR_DYNAMIC_FORM_MODELS and myDynamicObject.is_searchable?
            solr_search_results = myDynamicObject.search do
              keywords query_filter unless params[:query_filter].blank?
              paginate(:page => page, :per_page => per_page)
              order_by(sort.to_sym, dir.to_sym)
            end
            dynamic_records = solr_search_results.results
          else     
            dynamic_records = myDynamicObject.paginate(:page => page, :per_page => per_page, :order => "#{sort} #{dir}")
            dynamic_records = dynamic_records.joins(:dynamic_data).where("UPPER(dynamic_data.dynamic_attributes) LIKE UPPER('%#{query_filter}%')") unless params[:query_filter].blank?
          end

          related_fields = dynamic_records.first.form.related_fields rescue []

          wi = []
          dynamic_records.each do |i|
            wihash = i.data.dynamic_attributes_with_related_data(related_fields, false)
            wihash[:id] = i.id
            wihash[:created_username] = i.data.created_by.nil? ? '' : i.data.created_by.username
            wihash[:updated_username] = i.data.updated_by.nil? ? '' : i.data.updated_by.username
            wihash[:created_at] = i.data.created_at.getlocal.strftime("%m/%d/%Y")
            wihash[:updated_at] = i.data.updated_at.getlocal.strftime("%m/%d/%Y")
            wihash[:form_id] = (i.data.updated_with_form_id ? i.data.updated_with_form_id : i.data.created_with_form_id)
            wihash[:model_name] = params[:model_name]
            wi << wihash
          end

          render :inline => "{ total:#{dynamic_records.total_entries}, data:#{wi.to_json} }"
        rescue Exception => e
          Rails.logger.error e.message
          Rails.logger.error e.backtrace.join("\n")
          render :inline => {
            :success => false,
            :message => e.message
          }.to_json             
        end
      end
  
      #should not be modified
      #modify at your own risk
      def locate
        File.dirname(__FILE__)
      end
  
      class << self
        def title
          "Dynamic Grid"
        end
    
        def widget_name
          File.basename(File.dirname(__FILE__))
        end
      end
    end#Base
  end#DynamicGrid
end#Widgets
