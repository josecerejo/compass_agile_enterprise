class DynamicFormField
=begin
  Field Options TODO  
  searchable

  Field Types TODO
  special:
  password
  file upload

  complex (for future implementation):
  concatenated
  calculated
  related
=end

#  options = {
#    :fieldLabel => Field label text string
#    :name => Field variable name string
#    :allowBlank => required true or false
#    :value => prepopulated default value string
#    :readOnly => disabled true or false
#    :maxLength => maxLength integer
#    :width => size integer
#    :validation_regex => regex string
#  }

  ##################
  # SPECIAL FIELDS #
  ##################
  def self.email(options={})
    options[:validation_regex] = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
    DynamicFormField.basic_field('textfield', options)
  end

  def self.numberfield(options={})
    DynamicFormField.basic_field('numberfield', options)
  end

  def self.datefield(options={})
    DynamicFormField.basic_field('datefield', options)
  end

  def self.timefield(options={})
    DynamicFormField.basic_field('timefield', options)
  end

  def self.yesno(selections=[], options={})
    selections = [['yes', 'Yes'],['no', 'No']]
    DynamicFormField.basic_field('combobox', options, selections)
  end

  # a combobox that dynamically pulls options from a related model
  def self.related_combobox(model='', displayField = '', options={})
    options[:displayField] = displayField

    options[:extraParams] = {
      :model => model,
      :displayField => displayField
    }

    options[:fields] = [
        { :name => 'id' },
        { :name => displayField }
    ]

    options[:url] = '/erp_forms/erp_app/desktop/dynamic_forms/forms/related_field' if options[:url].blank?

    DynamicFormField.basic_field('related_combobox', options)
  end

  ################
  # BASIC FIELDS #
  ################  
  # selections is an array of tuples, i.e. [['AL', 'Alabama'],['AK', 'Alaska']] - [value, text]
  def self.combobox(selections=[], options={})
    DynamicFormField.basic_field('combobox', options, selections)
  end

  def self.textfield(options={})
    DynamicFormField.basic_field('textfield', options)
  end

  def self.textarea(options={})
    options[:height] = 100 if options[:height].nil? 
    DynamicFormField.basic_field('textarea', options)
  end

  def self.checkbox(options={})
    DynamicFormField.basic_field('checkbox', options)
  end

  def self.hidden(options={})
    DynamicFormField.basic_field('hidden', options)
  end
  
  def self.basic_field(xtype, options={}, selections=[])
    options = DynamicFormField.set_default_field_options(options)

    field = {
        :xtype => xtype,
        :fieldLabel => options[:fieldLabel],
        :name => options[:name],
        :value => options[:value],
        :allowBlank => options[:allowBlank],  
        :readOnly => options[:readOnly],
        :width =>options[:width],
        :height => options[:height],
        :labelWidth => options[:labelWidth]
    }

    field[:displayField] = options[:displayField] unless options[:displayField].blank?
    field[:extraParams] = options[:extraParams] unless options[:extraParams].blank?
    field[:url] = options[:url] unless options[:url].blank?
    field[:fields] = options[:fields] unless options[:fields].blank?
    
    field[:mapping] = options[:mapping] unless options[:mapping].blank?
    field[:maxLength] = options[:maxLength] unless options[:maxLength].nil?
    
    if selections and selections != []
      field[:store] = selections
    end

    if !options[:validation_regex].blank? or !options[:validator_function].blank?
      field[:validateOnBlur] = true
    end
    
    if options[:validation_regex] and options[:validation_regex] != ''
      field[:validation_regex] = options[:validation_regex]
    end

    if options[:validator_function] and options[:validator_function] != ''
      field[:validator_function] = options[:validator_function]
    end
    
    field
  end
  
  def self.set_default_field_options(options={})
        
    options[:fieldLabel] = '' if options[:fieldLabel].nil?
    options[:name] = '' if options[:name].nil?
    options[:allowBlank] = true if options[:allowBlank].nil?
    options[:value] = '' if options[:value].nil?
    options[:readOnly] = false if options[:readOnly].nil?
    options[:maxLength] = nil if options[:maxLength].nil?
    options[:width] = 200 if options[:width].nil?
    options[:height] = nil if options[:height].nil?
    options[:validation_regex] = '' if options[:validation_regex].nil?
    options[:labelWidth] = 75 if options[:labelWidth].nil?
    
    options
  end
  
end
