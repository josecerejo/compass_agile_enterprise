class DynamicForm < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :dynamic_form_model
  belongs_to :created_by, :class_name => "User"
  belongs_to :updated_by, :class_name => "User"

  validates_uniqueness_of :internal_identifier, :scope => :model_name

  extend FriendlyId
  friendly_id :description, :use => [:slugged], :slug_column => :internal_identifier
  def should_generate_new_friendly_id?
    new_record?
  end
  
  def self.class_exists?(class_name)
  	result = nil
  	begin
  	  klass = Module.const_get(class_name)
      result = (klass.is_a?(Class) ? ((klass.superclass == ActiveRecord::Base or klass.superclass == DynamicModel) ? true : nil) : nil)
  	rescue NameError
  	  result = nil
  	end
  	result
  end
  
  def self.get_form(klass_name, internal_identifier='')
    result = nil  	
	  result = DynamicForm.find_by_model_name_and_internal_identifier(klass_name, internal_identifier) unless internal_identifier.blank?
	  result = DynamicForm.find_by_model_name_and_default(klass_name, true) if result.nil?
  	result
  end
  
  # parse JSON definition into a ruby object 
  # returns an array of hashes
  def definition_object
    o = JSON.parse(self.definition)
    o.map do |i|
      i = i.symbolize_keys
    end
  end
  
  def definition_with_validation
    add_validation(self.definition_object)
  end
  
  def add_validation(def_object)
    def_object.each do |item|
      if !item[:validation_regex].blank?
        item[:regex] = NonEscapeJsonString.new(item[:validation_regex].match('^\/') ? item[:validation_regex] : '/'+item[:validation_regex]+'/')
      elsif !item[:validator_function].blank?
        item[:validator] = NonEscapeJsonString.new("function(v){ return #{item[:validator_function]}; }")
      end
    end
    
    def_object
  end

  def add_help_qtip(def_object)
    def_object.each do |item|
      item[:plugins] = NonEscapeJsonString.new('[new helpQtip("'+item[:help_qtip].gsub(/\"/,'\"')+'")]') unless item[:help_qtip].blank?
    end
    
    def_object
  end
  
  # will return an array of field names that are of xtype 'related_combobox'
  def related_fields
    related_fields = []
    definition_object.each do |f|
      related_fields << f if f[:xtype] == 'related_combobox'
    end

    related_fields
  end

  # check field against form definition to see if field still exists
  # returns true if field does not exist
  def deprecated_field?(field_name)
    result = true
	  definition_object.each do |field|
      result = false if field[:name] == field_name.to_s
    end
    
    result
  end
  
  def self.concat_fields_to_build_definition(array_of_fields)
    array_of_fields.to_json
  end
  
  def focus_first_field_js
    if self.focus_first_field
      return "form.getComponent(0).focus(true, 200);"
    else
      return ''
    end
  end

  def submit_empty_text_js
    if self.submit_empty_text
      return "submitEmptyText: true,"
    else
      return ''
    end
  end

  def to_extjs_formpanel(options={})   
    form_hash = {
      :xtype => 'dynamic_form_panel',
      :url => options[:url],
      :title => self.description,
      :frame => true,
      :bodyStyle => 'padding: 5px 5px 0;',
      :baseParams => {
        :dynamic_form_id => self.id,
        :dynamic_form_model_id => self.dynamic_form_model_id,
        :model_name => self.model_name
      },
      :defaults => {},
      :items => add_help_qtip(definition_with_validation)
    }
    form_hash[:defaults][:msgTarget] = self.msg_target unless self.msg_target.blank?
    form_hash[:width] = options[:width] if options[:width]
    form_hash[:baseParams][:id] = options[:record_id] if options[:record_id]
    form_hash[:listeners] = {
      :afterrender => NonEscapeJsonString.new("function(form) { #{focus_first_field_js} }")
    }
    form_hash[:buttons] = []
    form_hash[:buttons] << {
      :text => self.submit_button_label,
      :listeners => NonEscapeJsonString.new("{
          click:function(button){
              var form = button.findParentByType('form').getForm();
              //jsonSubmit option only works when there is no filefield so we have to do it ourselves
              //JSON is important to preserve data types (ie. we want integers to save as integers not strings)
              var form_data = {};
              Ext.each(form.getFields().items, function(field) {
                if (Ext.Array.indexOf(['filefield','fileuploadfield'], field.xtype) < 0){
                  form_data[field.name] = field.getValue();
                } 
              });
              if (form.isValid()){
                form.submit({
                    #{submit_empty_text_js}
                    reset:false,
                    params:{
                      form_data_json: Ext.encode(form_data)
                    },
                    success:function(form, action){
                        var obj = Ext.decode(action.response.responseText);
                        if(obj.success){
                          if (form.getRecord()){
                            form.owner.fireEvent('afterupdate');
                          }else{
                            form.owner.fireEvent('aftercreate', {
                              record: obj
                            });
                          }
                        }else{
                          Ext.Msg.alert('Error', obj.message);
                        }
                    },
                    failure:function(form, action){
                      Ext.Msg.alert('Error', action.response.responseText);
                    }
                });
              }else{
                Ext.Msg.alert('Error','Please complete form.');
              }
          }
      }")
    }
    form_hash[:buttons] << {
      :text => self.cancel_button_label,
      :listeners => NonEscapeJsonString.new("{
          \"click\":function(button){
            var form = button.findParentByType('form');
            if (form.close_selector){
              form.up(form.close_selector).close();
            }else{
              form.up('window').close();
            }
          }
      }")
    }
      
    form_hash   
  end
  
  # convert form definition to ExtJS form
  # definition is essentially the formpanel items
  #
  # options hash:
  # :url => pass in URL for form to post to
  # :widget_result_id => 
  # :width =>
  def to_extjs_widget(options={})
    javascript = "Ext.QuickTips.init(); Ext.create('Ext.form.Panel',"
    
    config_hash = {
      :url => "#{options[:url]}",
      :title => "#{self.description}",
      :frame => true,
      :bodyStyle => 'padding: 5px 5px 0;',
      :renderTo => 'dynamic_form_target',
      :baseParams => {
        :dynamic_form_id => self.id,
        :dynamic_form_model_id => self.dynamic_form_model_id,
        :model_name => self.model_name
      },
      :items => add_help_qtip(definition_with_validation),
      :defaults => {},
      :listeners => {
        :afterrender => NonEscapeJsonString.new("function(form) { #{focus_first_field_js} }")
      }
    }
    config_hash[:defaults][:msgTarget] = self.msg_target unless self.msg_target.blank?
    config_hash[:width] = options[:width] if options[:width]
    config_hash[:buttons] = []
    config_hash[:buttons] << {
      :text => self.submit_button_label,
      :listeners => NonEscapeJsonString.new("{
          \"click\":function(button){
              var form = button.findParentByType('form').getForm();
              //jsonSubmit option only works when there is no filefield so we have to do it ourselves
              //JSON is important to preserve data types (ie. we want integers to save as integers not strings)
              var form_data = {};
              Ext.each(form.getFields().items, function(field) {
                if (Ext.Array.indexOf(['filefield','fileuploadfield'], field.xtype) < 0){
                  form_data[field.name] = field.getValue();
                } 
              });
              form.submit({
                  #{submit_empty_text_js}
                  reset:true,
                  params:{
                    form_data_json: Ext.encode(form_data)
                  },
                  success:function(form, action){
                      json_hash = Ext.decode(action.response.responseText);
                      Ext.get('#{options[:widget_result_id]}').dom.innerHTML = json_hash.response;
                      var scriptTags = Ext.get('#{options[:widget_result_id]}').dom.getElementsByTagName('script');
                      Ext.each(scriptTags, function(scriptTag){
                            eval(scriptTag.text);
                      });
                  },
                  failure:function(form, action){
                    if (action.response){
                      json_hash = Ext.decode(action.response.responseText);
                      Ext.get('#{options[:widget_result_id]}').dom.innerHTML = json_hash.response;
                    }
                  }
              });
          }
      }")
    }
    config_hash[:buttons] << {
      :text => 'Reset',
      :listeners => NonEscapeJsonString.new("{
          \"click\":function(button){
              button.findParentByType('form').getForm().reset();
          }
      }")
    }

    javascript += "#{config_hash.to_json});"
    #logger.info javascript
    javascript
  end
  
end