class DynamicForm < ActiveRecord::Base
  belongs_to :dynamic_form_model
  belongs_to :created_by, :class_name => "User"
  belongs_to :updated_by, :class_name => "User"

  validates_uniqueness_of :internal_identifier, :scope => :model_name

  has_permalink :description, :internal_identifier, :update => false
  
  def self.class_exists?(class_name)
  	result = nil
  	begin
  	  klass = Module.const_get(class_name)
        result = klass.is_a?(Class) ? ((klass.superclass == ActiveRecord::Base or klass.superclass == DynamicModel) ? true : nil) : nil
  	rescue NameError
  	  result = nil
  	end
  	result
  end
  
  def self.get_form(klass_name, internal_identifier='')
    result = nil
  	unless internal_identifier.blank?
  	  result = DynamicForm.find_by_model_name_and_internal_identifier(klass_name, internal_identifier)
  	else
  	  result = DynamicForm.find_by_model_name_and_default(klass_name, true)
  	end
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
      if item[:validator_function] and item[:validator_function] != ""
        item[:validator] = NonEscapeJsonString.new("function(v){ regex = this.initialConfig.validation_regex; return #{item[:validator_function]}; }")
      elsif item[:validation_regex] and item[:validation_regex] != ""
        item[:validator] = NonEscapeJsonString.new("function(v){ return validate_regex(v, this.initialConfig.validation_regex); }")
      end
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
  
  def focus_first_field_js(model_name)
    if self.focus_first_field
      return "Ext.getCmp('dynamic_form_panel_#{model_name}').getComponent(0).focus(true, 200);"
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
  Rails.logger.info definition_with_validation 
    form_hash = {
      :xtype => 'form',
      :id => "dynamic_form_panel_#{model_name}",
      :url => options[:url],
      :title => self.description,
      :frame => true,
      :bodyStyle => 'padding: 5px 5px 0;'
    }
    
    form_hash[:width] = options[:width] if options[:width]
    form_hash[:baseParams] = {}
    form_hash[:baseParams][:id] = options[:record_id] if options[:record_id]
    form_hash[:baseParams][:dynamic_form_id] = self.id
    form_hash[:baseParams][:dynamic_form_model_id] = self.dynamic_form_model_id
    form_hash[:baseParams][:model_name] = self.model_name
    form_hash[:listeners] = {
      :afterrender => NonEscapeJsonString.new("function(form) { #{focus_first_field_js(self.model_name)} }")
    }
    form_hash[:items] = definition_with_validation
    form_hash[:buttons] = []
    form_hash[:buttons][0] = {
      :text => self.submit_button_label,
      :listeners => NonEscapeJsonString.new("{
          \"click\":function(button){
              var form = Ext.getCmp('dynamic_form_panel_#{model_name}').getForm();
              if (form.isValid()){
                form.submit({
                    #{submit_empty_text_js}
                    reset:true,
                    success:function(form, action){
                        Ext.getCmp('dynamic_form_panel_#{model_name}').findParentByType('window').close();
                        if (Ext.getCmp('#{model_name}')){
                            Ext.getCmp('#{model_name}').query('shared_dynamiceditablegrid')[0].store.load();                                                                      
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
    form_hash[:buttons][1] = {
      :text => self.cancel_button_label,
      :listeners => NonEscapeJsonString.new("{
          \"click\":function(button){
              Ext.getCmp('dynamic_form_panel_#{model_name}').findParentByType('window').close();
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
    options[:width] = "'auto'" if options[:width].nil?

    #NOTE: The random nbsp; forces IE to eval this javascript!
    javascript = "Ext.QuickTips.init();

          Ext.create('Ext.form.Panel',{
              id: 'dynamic_form_panel_#{model_name}',
              url:'#{options[:url]}',
              title: '#{self.description}',"

    javascript += "\"width\": #{options[:width]}," if options[:width]

    javascript += "frame: true,
              bodyStyle:'padding: 5px 5px 0;',
              renderTo: 'dynamic_form_target',
              baseParams: {
                dynamic_form_id: #{self.id},
                dynamic_form_model_id: #{self.dynamic_form_model_id},
                model_name: '#{self.model_name}'
              },
              items: #{definition_with_validation.to_json},
              listeners: {
                  afterrender: function(form) {
                      #{focus_first_field_js(self.model_name)}
                  }
              },
              buttons: [{
                  text: '#{self.submit_button_label}',
                  listeners:{
                      'click':function(button){
                          var formPanel = Ext.getCmp('dynamic_form_panel_#{model_name}');
                          formPanel.getForm().submit({
                              #{submit_empty_text_js}
                              reset:true,
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
                  }
                  
              },{
                  text: '#{self.submit_button_label}'
              }]
          });"
      #logger.info javascript
    javascript
  end
  
end