Ext.define('DynamicForm', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'number'},
    {name: 'description', type: 'string'},
    {name: 'model_name', type: 'string'},
    {name: 'definition', type: 'string'},
    {name: 'internal_identifier', type: 'string'},
    {name: 'widget_action', type: 'string'},
    {name: 'widget_email_recipients', type: 'string'},
    {name: 'focus_first_field', type: 'boolean'},
    {name: 'submit_empty_text', type: 'boolean'},
    {name: 'msg_target', type: 'string'},
    {name: 'submit_button_label', type: 'string'},
    {name: 'cancel_button_label', type: 'string'},
    {name: 'comment', type: 'string'},
    {name: 'created_at', type: 'string'},
    {name: 'updated_at', type: 'string'},
    {name: 'created_by', type: 'string'},
    {name: 'updated_by', type: 'string'}
  ]
});

// get a single form and fire openFormTab
Ext.create('Ext.data.Store', {
  model: 'DynamicForm',
  storeId: 'dynamicFormStore',
  timeout : 90000,
  proxy: {
      type: 'ajax',
      url: '/erp_forms/erp_app/desktop/dynamic_forms/forms/get_record',
      method: 'POST'
  },
  listeners:{
    'load':function(store, records){
      var record = store.getAt(0);
      Ext.getCmp('dynamic_forms_westregion').openFormTab(record);
    }
  },
  autoLoad: false
});

Ext.define('FieldType', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'text', type: 'string'},
        {name: 'field_xtype', type: 'string'},
        {name: 'fieldLabel', type: 'string'},
        {name: 'leaf', type: 'boolean'}
    ]
});

var fieldStore = Ext.create('Ext.data.TreeStore', {
    autoLoad:false,
    model: 'FieldType',
    proxy: {
        type: 'memory'
    },
    folderSort: true
});

var fieldData = {
    text:"Field Types",
    expanded: true,
    expandable: false,
    children: [
        {
            text: 'Checkbox',
            field_xtype: 'checkbox',
            leaf: true
        },
        {
            text: 'Combo Box',
            field_xtype: 'combobox',
            leaf: true
        },
        {
            text: 'Date Field',
            field_xtype: 'datefield',
            leaf: true
        },
        {
            text: 'Display Field',
            field_xtype: 'displayfield',
            leaf: true
        },
        {
            text: 'Email Field',
            field_xtype: 'email',
            leaf: true
        },
        {
            text: 'File Upload',
            field_xtype: 'filefield',
            leaf: true,
            vtype: 'file'
        },
        {
            text: 'Hidden Field',
            field_xtype: 'hiddenfield',
            leaf: true
        },
        {
            text: 'Number Field',
            field_xtype: 'numberfield',
            leaf: true
        },
        {
            text: 'Password Field',
            field_xtype: 'password',
            leaf: true
        },
        {
            text: 'Related Combo Box',
            field_xtype: 'related_combobox',
            leaf: true,
            qtip: 'Combo Box with dynamic store. Use limited to secure pages.'
        },
        {
            text: 'Text Field',
            field_xtype: 'textfield',
            leaf: true
        },
        {
            text: 'Text Area',
            field_xtype: 'textarea',
            leaf: true
        },
        {
            text: 'Time Field',
            field_xtype: 'timefield',
            leaf: true
        },
        {
            text: 'Yes / No',
            field_xtype: 'yesno',
            leaf: true
        }
    ]};

var fieldTreeRootNode = fieldStore.setRootNode(fieldData);

Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.FormBuilder",{
    extend:"Ext.panel.Panel",
    alias:'widget.dynamic_forms_FormBuilder',

    height: 458,
    width: 811,
    layout: {
        type: 'border'
    },

    setWindowStatus : function(status){
        this.findParentByType('statuswindow').setStatus(status);
    },

    clearWindowStatus : function(){
        this.findParentByType('statuswindow').clearStatus();
    },

    initComponent : function() {

        this.addEvents(
            /**
         * @event publish_success
         * Fired after success response is recieved from server
         * @param {Compass.ErpApp.Applications.Desktop.PublishWindow} this Object
         * @param {Object} Server Response
         */
            "publish_success",
            /**
         * @event publish_failure
         * Fired after response is recieved from server with error
         * @param {Compass.ErpApp.Applications.Desktop.PublishWindow} this Object
         * @param {Object} Server Response
         */
            "publish_failure"
            );

		this.callParent(arguments);
    },

    getFieldOptionsForField : function(field){
        var xtype = field.xtype;
        var field_xtype = field.field_xtype; // used to determine if it is a hidden field

        var updateName = {
            fieldLabel: 'Name',
            name: 'updateName',
            xtype: 'textfield',
            allowBlank: false
        };

        if (xtype == 'filefield') updateName.readOnly = true;

        //console.log(xtype);
        var base_top = [
            updateName,
            {
                fieldLabel: 'Label',
                name: 'updateLabel',
                xtype: 'textfield',
                allowBlank: false
            }
        ];

        var common = [
            {
                fieldLabel: 'Label Alignment',
                name: 'updateLabelAlign',
                xtype: 'combobox',
                allowBlank: false,
                editable: true,
                forceSelection:true,
                value: 'left',
                store: [
                    ['left', 'Left of Field'],
                    ['top', 'Above Field']
                ]
            },
            {
                fieldLabel: 'Label Width',
                name: 'updateLabelWidth',
                xtype: 'numberfield'
            },
            {
                fieldLabel: 'Width',
                name: 'updateWidth',
                xtype: 'numberfield'
            },
            {
                fieldLabel: 'Height',
                name: 'updateHeight',
                xtype: 'numberfield'
            },
            {
                fieldLabel: 'Empty Text',
                name: 'updateEmptyText',
                xtype: 'textfield'
            },
            {
                fieldLabel: 'Allow Blank',
                name: 'updateAllowBlank',
                xtype: 'checkbox'
            }
        ];

        var base_bottom = [
            {
                fieldLabel: 'Default Value',
                name: 'updateValue',
                xtype: 'textfield'
            },
            {
                fieldLabel: 'Read Only',
                name: 'updateReadOnly',
                xtype: 'checkbox'
            },
            {
                fieldLabel: 'Display In Grid',
                name: 'updateDisplayInGrid',
                xtype: 'checkbox'
            }
        ];

        var filefield = [
            {
                fieldLabel: 'Button Text',
                name: 'updateButtonText',
                xtype: 'textfield'
            }
        ];

        var common_combobox = [
            {
                fieldLabel: 'Editable',
                name: 'updateEditable',
                xtype: 'checkbox'
            },
            {
                fieldLabel: 'Force Selection',
                name: 'updateForceSelection',
                xtype: 'checkbox'
            },
            {
                fieldLabel: 'Multi Select',
                name: 'updateMultiSelect',
                xtype: 'checkbox'
            }
        ];

        var combobox = [            
            {
                fieldLabel: 'Options',
                name: 'updateOptions',
                xtype: 'textarea',
                labelAlign: 'top',
                labelWidth: 50,
                allowBlank: false,
                width: 235,
                height: 175,
                plugins: [new helpQtip('Add options with a comma separated list. Example: value,Description,option2,Option 2')]
            }
        ];

        var related_combobox = [            
            {
                fieldLabel: 'Related Model',
                name: 'updateRelatedModel',
                xtype: 'textfield',
                allowBlank: false,
                vtype: 'alphanum',
                plugins: [new helpQtip('Needs to be a valid camel case model class name.')]
            },
            {
                fieldLabel: 'Display Field',
                name: 'updateDisplayField',
                xtype: 'textfield',
                allowBlank: false,
                plugins: [new helpQtip('Needs to be a valid column name on the related model.')]
            }
        ];

        var minMaxLength = [
            {
                fieldLabel: 'Min Length',
                name: 'updateMinLength',
                xtype: 'numberfield'
            },
            {
                fieldLabel: 'Max Length',
                name: 'updateMaxLength',
                xtype: 'numberfield'
            }
        ];

        var numberMinMaxValue = [
            {
                fieldLabel: 'Min Value',
                name: 'updateMinValue',
                xtype: 'numberfield'
            },
            {
                fieldLabel: 'Max Value',
                name: 'updateMaxValue',
                xtype: 'numberfield'
            }
        ];

        var dateMinMaxValue = [
            {
                fieldLabel: 'Min Value',
                name: 'updateMinValue',
                xtype: 'datefield'
            },
            {
                fieldLabel: 'Max Value',
                name: 'updateMaxValue',
                xtype: 'datefield'
            }
        ];

        var timeMinMaxValue = [
            {
                fieldLabel: 'Min Value',
                name: 'updateMinValue',
                xtype: 'timefield'
            },
            {
                fieldLabel: 'Max Value',
                name: 'updateMaxValue',
                xtype: 'timefield'
            }
        ];

        var validation = [
            {
                fieldLabel: 'Validation Type',
                name: 'updateValidationType',
                xtype: 'combobox',
                queryMode: 'local',
                store:[
                    ['none','None'],
                    ['regex','Regular Expression'],
                    ['function','Custom Function'],
                    ['vtype','VType']
                ],
                value: 'none',
                forceSelection: true,
                allowBlank: false,
                listeners:{
                    change: function(field, newValue, oldValue, eOpts){
                        var field_props = this.findParentByType('form');
                        var updateValidationRegex = field_props.getForm().findField('updateValidationRegex');
                        var updateValidationRegexText = field_props.getForm().findField('updateValidationRegexText');
                        var updateValidationFunction = field_props.getForm().findField('updateValidationFunction');
                        var updateValidationVType = field_props.getForm().findField('updateValidationVType');
                        if (newValue == 'regex'){
                            updateValidationRegex.show();
                            updateValidationRegex.enable();
                            updateValidationRegexText.show();
                            updateValidationRegexText.enable();
                            updateValidationFunction.hide();
                            updateValidationFunction.disable();
                            updateValidationVType.hide();
                            updateValidationVType.disable();
                        }else if (newValue == 'function'){
                            updateValidationFunction.show();
                            updateValidationFunction.enable();
                            updateValidationRegex.hide();
                            updateValidationRegex.disable();
                            updateValidationRegexText.hide();
                            updateValidationRegexText.disable();
                            updateValidationVType.hide();
                            updateValidationVType.disable();
                        }else if (newValue == 'vtype'){
                            updateValidationVType.show();
                            updateValidationVType.enable();
                            updateValidationRegex.hide();
                            updateValidationRegex.disable();
                            updateValidationRegexText.hide();
                            updateValidationRegexText.disable();
                            updateValidationFunction.hide();
                            updateValidationFunction.disable();
                        }else{
                            updateValidationFunction.hide();
                            updateValidationFunction.disable();
                            updateValidationRegex.hide();
                            updateValidationRegex.disable();
                            updateValidationRegexText.disable();
                            updateValidationRegexText.hide();
                            updateValidationVType.hide();
                            updateValidationVType.disable();
                        }
                    }
                }
            },
            {
                fieldLabel: 'Regex',
                name: 'updateValidationRegex',
                xtype: 'textfield',
                allowBlank: true,
                hidden: true,
                disabled: true
            },
            {
                fieldLabel: 'Regex Text',
                name: 'updateValidationRegexText',
                xtype: 'textfield',
                allowBlank: true,
                hidden: true,
                disabled: true
            },
            {
                fieldLabel: 'Function',
                name: 'updateValidationFunction',
                plugins: [new helpQtip('Call a pre-existing JavaScript function for custom validation. Field value must be passed in using variable v. No semicolon required. Example: customFunction(v)')],
                xtype: 'textfield',
                allowBlank: true,
                hidden: true,
                disabled: true,
                emptyText: 'customFunction(v)'
            },
            {
                fieldLabel: 'VType',
                name: 'updateValidationVType',
                xtype: 'combobox',
                queryMode: 'local',
                store:[
                    ['alpha','Alpha'],
                    ['alphanum','Alphanumeric'],
                    ['email','Email'],
                    ['url','URL']
                ],
                plugins: [new helpQtip('Use a built-in or custom ExtJS VType.')],
                editable: true,
                forceSelection: false,
                hidden: true,
                disabled: true,
                allowBlank: true
            }
        ];

        var result = [];
        if (Ext.isEmpty(field_xtype)){
            result = result.concat(base_top);
            result = result.concat(common);
            result = result.concat(base_bottom);
        }else if (field_xtype == 'hiddenfield'){
            result = result.concat(base_top);
            result = result.concat(base_bottom);
            return result;
        }
        switch(xtype){
            case 'related_combobox':            
              result = result.concat(common_combobox);
              result = result.concat(related_combobox);
              break;
            case 'combo':            
              result = result.concat(common_combobox);
              result = result.concat(combobox);
              break;
            case 'combobox':
              result = result.concat(common_combobox);
              result = result.concat(combobox);
              break;
            case 'datefield':
              result = result.concat(dateMinMaxValue);
              result = result.concat(validation);
              break;
            case 'email':
              result = result.concat(minMaxLength);
              result = result.concat(validation);
              break;
            case 'filefield':   
              result = result.concat(filefield);
              result = result.concat(validation);
              break;
            case 'numberfield':
              result = result.concat(minMaxLength);
              result = result.concat(numberMinMaxValue);              
              result = result.concat(validation);
              break;
            case 'password':
              result = result.concat(minMaxLength);
              result = result.concat(validation);
              break;
            case 'textfield':
              result = result.concat(minMaxLength);
              result = result.concat(validation);
              break;
            case 'textarea':
              result = result.concat(minMaxLength);
              result = result.concat(validation);
              break;
            case 'timefield':
              result = result.concat(timeMinMaxValue);
              result = result.concat(validation);
              break;
            default:
        }

        return result;
    },

    validateFieldNameUnique : function(formPanel, fieldName){
        return ((this.getIndexOfFieldByName(formPanel, fieldName) < 0) ? true : false);
    },

    getIndexOfFieldByName : function(formPanel, fieldName){
        for (var i = 0; i < formPanel.form_definition.length; i++) {
            if (formPanel.form_definition[i].name == fieldName){
                return i;
            }
        }
        return -1;
    },

    moveField : function(formPanel, direction){
        if (Ext.isEmpty(formPanel.selected_field)){
            Ext.Msg.alert('Error', 'Please select a field to move.');
        }else{       
            var i = 0;
            var field_in_definition = null;
            // find selected field in definition to remove it
            Ext.each(formPanel.form_definition, function(field){
                if (field.name == formPanel.selected_field.name){ 
                    idx = i; 
                    field_in_definition = field;
                }
                i++;
            });
            if (direction == 'up' && idx === 0){
                Ext.Msg.alert('Error', 'Cannot move. Field is already at top.');
            }else if (direction == 'down' && idx == (formPanel.form_definition.length-1)){
                Ext.Msg.alert('Error', 'Cannot move. Field is already at bottom.');
            }else{
                var new_index = (direction == 'up' ? idx-1 : idx+1);
                formPanel.form_definition.splice(idx, 1); // remove field from definition
                formPanel.form_definition.splice(new_index, 0, field_in_definition); // add field to definition
                formPanel.findParentByType('dynamic_forms_FormBuilder').reloadForm(formPanel); // redraw form from definition
                formPanel.getForm().findField(formPanel.selected_field.name).getEl().dom.click(); // highlight selected field
            }
        }
    },

    emailRegex : function(){
        return ErpTechSvcs.Config.email_regex;
    },

    addFieldToForm : function(formPanel, fieldDefinition){
        if (fieldDefinition) formPanel.form_definition.push(fieldDefinition);
        this.reloadForm(formPanel);
        // highlight newly added field
        if (fieldDefinition) formPanel.getForm().findField(fieldDefinition.name).getEl().dom.click();
    },

    addValidationToField : function(field){
        if(!Ext.isEmpty(field.validation_regex)){
            field.regex = initRegex(field.validation_regex);
        }else if(!Ext.isEmpty(field.validator_function)){
            field.validator = function(v){ return eval(field.validator_function); };
        }
        return field;
    },

    convertHiddenFieldToDisplayFieldForUi : function(field){
        if (field.xtype == 'hiddenfield'){
            field.xtype = 'displayfield';
            field.field_xtype = 'hiddenfield';
        }
        return field;
    },

    // alterFileUploadField : function(field){
    //         if (field.xtype == 'filefield'){
    //             console.log('filefield');
    //             field.listeners = {
    //                 'render': function(field){ 
    //                     console.log('listener');
    //                     field.inputEl.dom.size = 20; 
    //                 }
    //             };
    //         }
    //     return field;
    // },

    reloadForm : function(formPanel){
        var self = this;
        formPanel.removeAll();
        var form_definition_copy = Ext.clone(formPanel.form_definition); // make independent copy
        Ext.each(form_definition_copy, function(field){
            field = self.convertHiddenFieldToDisplayFieldForUi(field);
            field = self.addValidationToField(field);
            //field = self.alterFileUploadField(field);
            field = self.addHighlightListenerForSelectedField(field);
        });
        formPanel.add(form_definition_copy);        
    },

    addHighlightListenerForSelectedField : function(field){
        field.listeners = {
            render: function(item){
                var el = item.getEl();
                el.addListener('click', function(e, t, eOpts){    
                    var formPanel = item.findParentByType('form');
                    var highlight_border = '1px solid green';
                    //console.log(el.dom.style.border);
                    if (el.dom.style.border != highlight_border){
                        Ext.each(formPanel.items.items, function(i){
                            //console.log(i.getEl().getStyle('border'));
                            if (item != i && i.getEl().dom.style.border == highlight_border){
                                var label = i.getEl().query('label').first();
                                label.style.width = (parseInt(label.style.width, 10) + 2) + 'px';
                                i.getEl().setStyle('border', 'none');
                            }
                        });
                        var label = el.query('label').first();
                        label.style.width = (parseInt(label.style.width, 10) - 2) + 'px';
                        el.setStyle('border', highlight_border);
                        el.highlight();

                        // set field properties as active tab
                        var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                        var east_tabs = formBuilder.query('#east_tabs').first();
                        east_tabs.setActiveTab('field_props');

                        formPanel.selected_field = item;

                        // populate field properties
                        var prop_formPanel = east_tabs.query('#field_props').first();
                        var prop_form = prop_formPanel.getForm();
                        prop_formPanel.removeAll();
                        prop_formPanel.add(formBuilder.getFieldOptionsForField(item));                    

                        // common
                        try { prop_form.findField('updateName').setValue(item.name); } catch(e) {}
                        try { prop_form.findField('updateLabel').setValue(item.fieldLabel); } catch(e) {}
                        try { prop_form.findField('updateLabelAlign').setValue(item.labelAlign); } catch(e) {}
                        try { var updateValue = ((item.xtype == 'related_combobox') ? item.default_value : item.value);
                              prop_form.findField('updateValue').setValue(updateValue); } catch(e) {}
                        try { prop_form.findField('updateEmptyText').setValue(item.emptyText); } catch(e) {}
                        try { prop_form.findField('updateAllowBlank').setValue(item.allowBlank); } catch(e) {}
                        try { prop_form.findField('updateDisplayInGrid').setValue(item.display_in_grid); } catch(e) {}
                        try { prop_form.findField('updateReadOnly').setValue(item.readOnly); } catch(e) {}
                        try { prop_form.findField('updateWidth').setValue(item.width); } catch(e) {}
                        try { prop_form.findField('updateHeight').setValue(item.height); } catch(e) {}
                        try { prop_form.findField('updateLabelWidth').setValue(item.labelWidth); } catch(e) {}

                        if (item.xtype == 'datefield' || item.xtype == 'timefield'){
                            prop_form.findField('updateMinValue').setValue(item.minValue);
                            prop_form.findField('updateMaxValue').setValue(item.maxValue);
                        } 

                        if(!Ext.isEmpty(item.regex)){
                            prop_form.findField('updateValidationType').setValue('regex');
                            prop_form.findField('updateValidationRegex').setValue(item.regex);  
                            if(!Ext.isEmpty(item.regexText)) prop_form.findField('updateValidationRegexText').setValue(item.regexText);                            
                        }else if(!Ext.isEmpty(item.validator_function)){
                            prop_form.findField('updateValidationType').setValue('function');
                            prop_form.findField('updateValidationFunction').setValue(item.validator_function);                        
                        }else if(!Ext.isEmpty(item.vtype)){
                            prop_form.findField('updateValidationType').setValue('vtype');
                            prop_form.findField('updateValidationVType').setValue(item.vtype);                        
                        }

                        if (item.xtype == 'numberfield'){
                            if (item.minValue != Number.NEGATIVE_INFINITY){
                                prop_form.findField('updateMinValue').setValue(item.minValue);
                            }
                            if (item.maxValue != Number.MAX_VALUE){
                                prop_form.findField('updateMaxValue').setValue(item.maxValue);                        
                            }
                        }

                        if (item.xtype == 'textfield' || item.xtype == 'textarea' || item.xtype == 'numberfield'){
                            prop_form.findField('updateMinLength').setValue(item.minLength);
                            if (item.maxLength != Number.MAX_VALUE){
                                prop_form.findField('updateMaxLength').setValue(item.maxLength);
                            }
                        }

                        if (item.xtype == 'related_combobox'){
                            prop_form.findField('updateEditable').setValue(item.editable);
                            prop_form.findField('updateForceSelection').setValue(item.forceSelection);
                            prop_form.findField('updateMultiSelect').setValue(item.multiSelect);
                            prop_form.findField('updateRelatedModel').setValue(item.extraParams.model);
                            prop_form.findField('updateDisplayField').setValue(item.displayField);
                        }else if (item.xtype == 'combobox' || item.xtype == 'combo'){
                            var options = Ext.encode(item.getStore().proxy.reader.rawData).replace(/\"/g,'').replace(/\[/g,'').replace(/\]/g,'');
                            prop_form.findField('updateOptions').setValue(options);
                            prop_form.findField('updateEditable').setValue(item.editable);
                            prop_form.findField('updateForceSelection').setValue(item.forceSelection);
                            prop_form.findField('updateMultiSelect').setValue(item.multiSelect);
                        }

                        if (item.xtype == 'filefield'){
                            prop_form.findField('updateButtonText').setValue(item.buttonText);
                        }
                        
                    }
                });
            }
        };

        return field;
    },

    constructor : function(config) {
        if (Ext.isEmpty(config.form_definition)) config.form_definition = [];

        config = Ext.apply({
            id: 'formBuilder_'+config.title,
            layout:'border',
            title: config.title || 'New Form',
            border: false,
            closable: true,
            autoHeight:true,
            buttonAlign:'center',
            items: [{
                    xtype: 'form',
                    itemId: 'dynamicForm',
                    region: 'center',
                    autoScroll: true,
                    bodyPadding: 10,
                    form_definition: config.form_definition,
                    form_id: (Ext.isEmpty(config.form_id) ? null : config.form_id),
                    defaults:{
                        msgTarget: (Ext.isEmpty(config.msg_target) ? 'left' : config.msg_target)
                    },
                    tbar: [
                      { xtype: 'button', 
                        text: 'Save Form',
                        iconCls: 'icon-save',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                            var form_props = formBuilder.query('#form_props').first().getForm();

                            if (form_props.isValid()){
                                var create = Ext.isEmpty(config.form_id);
                                formBuilder.setWindowStatus('Saving form ...');
                                Ext.Ajax.request({
                                  url: (create === true ? '/erp_forms/erp_app/desktop/dynamic_forms/forms/create' : '/erp_forms/erp_app/desktop/dynamic_forms/forms/update'),
                                  method: 'POST',
                                  params:{
                                    id:config.form_id,
                                    form_definition:Ext.JSON.encode(formPanel.form_definition),
                                    description: form_props.findField('description').getValue(),
                                    model_name: config.model_name,
                                    widget_action: form_props.findField('widget_action').getValue(),
                                    widget_email_recipients: form_props.findField('widget_email_recipients').getValue(),
                                    focus_first_field: form_props.findField('focus_first_field').getValue(),
                                    submit_empty_text: form_props.findField('submit_empty_text').getValue(),
                                    msg_target: form_props.findField('msg_target').getValue(),
                                    submit_button_label: form_props.findField('submit_button_label').getValue(),
                                    cancel_button_label: form_props.findField('cancel_button_label').getValue(),
                                    comment: form_props.findField('comment').getValue()
                                  },
                                  success: function(response) {
                                    formBuilder.clearWindowStatus();
                                    var obj =  Ext.decode(response.responseText);
                                    if(obj.success){
                                        if (create === true){
                                            Ext.getCmp('dynamic_formsTabPanel').remove(formBuilder);
                                            Ext.getStore('dynamicFormStore').load({ params:{ id: obj.id } });
                                            Ext.getStore('formsTreeStore').load();
                                        }else{
                                            formBuilder.setTitle(form_props.findField('description').getValue());
                                            //Ext.Msg.alert('Success', 'Form saved.');
                                        }
                                    }
                                    else{
                                      Ext.Msg.alert('Error', 'Error saving form.');
                                    }
                                  },
                                  failure: function(response) {
                                    formBuilder.clearWindowStatus();
                                    Ext.Msg.alert('Error', 'Error saving form');
                                  }
                                });
                            }else{
                                Ext.Msg.alert('Error', "There is a validation error with this form's properties. Please correct fields marked red.");
                            }
                          }
                        }
                      },
                      { xtype: 'button', 
                        text: 'View Definition',
                        iconCls: 'icon-document',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            var form_definition = Ext.encode(formPanel.form_definition).replace(/,/gi,', ').replace(/\},/gi,'},<br />');
                            // popup window panel with form definition
                            //Ext.MessageBox.minWidth = 600;
                            //var alertBox = Ext.create("Ext.MessageBox",{ width: 600 });
                            //Ext.MessageBox.alert('Form Definition', );

                            var defWindow = Ext.create("Ext.window.Window",{
                                      layout:'fit',
                                      title:'Form Definition',
                                      //plain: true,
                                      buttonAlign:'center',
                                      items: Ext.create("Ext.panel.Panel",{                                        
                                        bodyStyle:'padding:5px 5px 0',
                                        html: form_definition
                                      }),
                                      buttons: [{
                                        text:'Close',
                                        listeners:{
                                          'click':function(button){
                                            defWindow.close();
                                          }
                                        }
                                    }]
                                });
                            defWindow.show();
                          }
                        }
                      },                      
                      { xtype: 'button', 
                        text: 'Move Field Up',
                        iconCls: 'icon-arrow-up-blue',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            formPanel.findParentByType('dynamic_forms_FormBuilder').moveField(formPanel, 'up');
                          }
                        }
                      },
                      { xtype: 'button', 
                        text: 'Move Field Down',
                        iconCls: 'icon-arrow-down-blue',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            formPanel.findParentByType('dynamic_forms_FormBuilder').moveField(formPanel, 'down');
                          }
                        }
                      },
                      { xtype: 'button', 
                        text: 'Remove Selected Field',
                        iconCls: 'icon-delete',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');

                            if (Ext.isEmpty(formPanel.selected_field)){
                                Ext.Msg.alert('Error', 'Please select a field to remove.');
                            }else{       
                                Ext.MessageBox.confirm('Confirm', 'Are you sure you want to remove this field?',
                                  function(btn){
                                    if(btn == 'no'){
                                        return false;
                                    }
                                    else if(btn == 'yes')
                                    {
                                        var i = 0;
                                        // find selected field in definition to remove it
                                        Ext.each(formPanel.form_definition, function(field){
                                            if (field.name == formPanel.selected_field.name){ idx = i; }
                                            i++;
                                        });
                                        formPanel.form_definition.splice(idx, 1); // remove field from definition
                                        formPanel.selected_field = null; // deselect field that was removed
                                        formPanel.findParentByType('dynamic_forms_FormBuilder').reloadForm(formPanel); // redraw form from definition
                                    }
                                  }
                                );
                            }
                          }
                        }
                      }                     
                    ],
                    listeners:{
                        render:function(formPanel){
                            formPanel.findParentByType('dynamic_forms_FormBuilder').reloadForm(formPanel);
                            var formPanelDropTargetEl = formPanel.body.dom;
                            var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
                                ddGroup: 'fieldsDDGroup',
                                notifyEnter: function(ddSource, e, data) {
                                    formPanel.body.stopAnimation();
                                    formPanel.body.highlight();
                                },
                                notifyDrop  : function(ddSource, e, data){
                                    var droppedField = data.records[0];

                                    var addFieldWindow = Ext.create("Ext.window.Window",{
                                      layout:'fit',
                                      width:375,
                                      title:'Add Field to Form',
                                      height:100,
                                      plain: true,
                                      buttonAlign:'center',
                                      items: Ext.create("Ext.form.Panel",{
                                        labelWidth: 110,
                                        frame:false,
                                        bodyStyle:'padding:5px 5px 0',
                                        defaults: {
                                          width: 225
                                        },
                                        items: [
                                        {
                                          xtype:'textfield',
                                          fieldLabel:'Field Name',
                                          allowBlank:false,
                                          name:'field_name',
                                          value: (droppedField.get('field_xtype') == 'filefield' ? 'file' : ''),
                                          readOnly: (droppedField.get('field_xtype') == 'filefield' ? true : false),
                                          maskRe: /^\w+$/,
                                          regex: /^\w+$/,
                                          plugins: [new helpQtip('Only letters, numbers and underscores are valid. Field Names must be unique. A File Upload field must be named "file".')],
                                          listeners:{
                                            afterrender:function(field){
                                                field.focus(false, 200);
                                            },
                                            'specialkey': function(field, e){
                                              if (e.getKey() == e.ENTER) {
                                                var button = field.findParentByType('window').query('#submitButton').first();
                                                button.fireEvent('click', button);
                                              }
                                            }
                                          }
                                        }
                                        ]
                                      }),
                                      buttons: [{
                                        itemId: 'submitButton',
                                        text:'Submit',
                                        listeners:{
                                          'click':function(button){
                                            var window = button.findParentByType('window');
                                            var addFieldFormPanel = window.query('form')[0];
                                            var field_name = addFieldFormPanel.getForm().findField('field_name').getValue();
                                            var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                                            
                                            if (!formBuilder.validateFieldNameUnique(formPanel, field_name)){
                                                Ext.Msg.alert('Error', 'Field Name must be unique.');
                                                return;
                                            }

                                            var fieldDefinition = {
                                                xtype: droppedField.get('field_xtype'),
                                                name: field_name,
                                                fieldLabel: (droppedField.get('field_xtype') == 'hiddenfield' ? 'Hidden Field' : field_name.titleize()),
                                                display_in_grid: true,
                                                labelWidth: 75
                                            };

                                            switch(fieldDefinition.xtype){
                                                case 'hiddenfield':
                                                    fieldDefinition.display_in_grid = false;
                                                    break;
                                                case 'related_combobox':
                                                    fieldDefinition.width = 175;
                                                    fieldDefinition.editable = true;
                                                    fieldDefinition.forceSelection = true;
                                                    break;
                                                case 'combobox':
                                                    fieldDefinition.editable = true;
                                                    fieldDefinition.forceSelection = true;
                                                    break;
                                                case 'yesno':
                                                    fieldDefinition.xtype = 'combobox';
                                                    fieldDefinition.forceSelection = true;
                                                    fieldDefinition.store = [['no','No'],['yes','Yes']];
                                                    break;
                                                case 'email':
                                                    fieldDefinition.xtype = 'textfield';
                                                    fieldDefinition.validator_function = 'validateEmail(v)';
                                                    break;
                                                case 'password':
                                                    fieldDefinition.xtype = 'textfield';
                                                    fieldDefinition.inputType = 'password';
                                                    break;
                                                case 'filefield':
                                                    fieldDefinition.vtype = 'file';
                                                    fieldDefinition.name = 'file';
                                                    // fieldDefinition.inputType = 'file'; // needed for fileSize validation but it causes some cosmetic problems
                                                    // fieldDefinition.buttonConfig = {hidden: true};
                                                    break;
                                                default:
                                            }

                                            formBuilder.addFieldToForm(formPanel, fieldDefinition);

                                            addFieldWindow.close();
                                          }
                                        }
                                      },{
                                        text: 'Close',
                                        handler: function(){
                                          addFieldWindow.close();
                                        }
                                      }]
                                    });
                                    addFieldWindow.show();
                                    
                                    return true;
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'tabpanel',
                    itemId: 'east_tabs',
                    region: 'east',
                    width: 265,
                    activeTab: 0,
                    defaults:{
                        width: 255
                    },
                    items: [                        
                        {
                            xtype: 'form',
                            title: 'Field Properties',
                            itemId: 'field_props',
                            autoScroll: true,
                            bodyPadding: 10,
                            tbar: [
                              { xtype: 'button', 
                                text: 'Update Field',
                                iconCls: 'icon-edit',

                                listeners:{
                                  click: function(button){
                                    // get formPanel
                                    var updateFieldForm = button.findParentByType('form').getForm();
                                    if (updateFieldForm.isValid()){
                                        var formPanel = Ext.getCmp('formBuilder_'+config.title).query('#dynamicForm').first();
                                        var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                                        var selected_field = formPanel.selected_field;
                                        var updateName = updateFieldForm.findField('updateName').getValue();

                                        // build field json
                                        var fieldDefinition = {
                                            xtype: (selected_field.field_xtype == 'hiddenfield' ? 'hiddenfield' : selected_field.xtype),
                                            name: updateName,
                                            fieldLabel: updateFieldForm.findField('updateLabel').getValue()
                                        };

                                        try { fieldDefinition.labelAlign = updateFieldForm.findField('updateLabelAlign').getValue(); } catch(e){}
                                        try { fieldDefinition.readOnly = updateFieldForm.findField('updateReadOnly').getValue(); } catch(e){}
                                        try { var updateEmptyText = updateFieldForm.findField('updateEmptyText').getValue();
                                              if (!Ext.isEmpty(updateEmptyText)) fieldDefinition.emptyText = updateEmptyText; } catch(e){}
                                        try { fieldDefinition.allowBlank = updateFieldForm.findField('updateAllowBlank').getValue(); } catch(e){}
                                        try { fieldDefinition.display_in_grid = updateFieldForm.findField('updateDisplayInGrid').getValue(); } catch(e){}                                        
                                        try { var updateValue = updateFieldForm.findField('updateValue').getValue();
                                              if (selected_field.xtype == 'related_combobox') {
                                                if (!Ext.isEmpty(updateValue)) fieldDefinition.default_value = parseInt(updateValue, 10);
                                              }else{
                                                if (!Ext.isEmpty(updateValue)) fieldDefinition.value = updateValue; 
                                              }
                                        } catch(e){}
                                        try { var updateLabelWidth = updateFieldForm.findField('updateLabelWidth').getValue();
                                              if (!Ext.isEmpty(updateLabelWidth)) fieldDefinition.labelWidth = updateLabelWidth; } catch(e){}
                                        try { var updateWidth = updateFieldForm.findField('updateWidth').getValue();
                                              if (!Ext.isEmpty(updateWidth)) fieldDefinition.width = updateWidth; } catch(e){}
                                        try { var updateHeight = updateFieldForm.findField('updateHeight').getValue();
                                              if (!Ext.isEmpty(updateHeight)) fieldDefinition.height = updateHeight; } catch(e){}
                                        
                                        if (Ext.isEmpty(selected_field.field_xtype) && selected_field.xtype != 'related_combobox' && selected_field.xtype != 'combobox' && selected_field.xtype != 'combo'){
                                            switch(updateFieldForm.findField('updateValidationType').getValue()){
                                                case 'regex':
                                                    var validationRegex = updateFieldForm.findField('updateValidationRegex').getValue();
                                                    if(!Ext.isEmpty(validationRegex)) fieldDefinition.validation_regex = validationRegex;
                                                    fieldDefinition.regexText = updateFieldForm.findField('updateValidationRegexText').getValue();
                                                    break;
                                                case 'function':
                                                    fieldDefinition.validator_function = updateFieldForm.findField('updateValidationFunction').getValue();
                                                    break;
                                                case 'vtype':
                                                    fieldDefinition.vtype = updateFieldForm.findField('updateValidationVType').getValue();
                                                    break;
                                                default:
                                            }
                                        }

                                        if (selected_field.xtype == 'datefield' || selected_field.xtype == 'timefield' || selected_field.xtype == 'numberfield'){
                                            var updateMinValue = updateFieldForm.findField('updateMinValue').getValue();
                                            var updateMaxValue = updateFieldForm.findField('updateMaxValue').getValue();
                                            if(!Ext.isEmpty(updateMinValue)) fieldDefinition.minValue = updateMinValue;
                                            if(!Ext.isEmpty(updateMaxValue)) fieldDefinition.maxValue = updateMaxValue;                                            
                                        } 

                                        if (selected_field.xtype == 'textfield' || selected_field.xtype == 'textarea' || selected_field.xtype == 'numberfield'){
                                            var updateMinLength = updateFieldForm.findField('updateMinLength').getValue();
                                            var updateMaxLength = updateFieldForm.findField('updateMaxLength').getValue();
                                            if(!Ext.isEmpty(updateMinLength)) fieldDefinition.minLength = updateMinLength;                                            
                                            if(!Ext.isEmpty(updateMaxLength)) fieldDefinition.maxLength = updateMaxLength;                                            
                                        }

                                        if (selected_field.xtype == 'filefield'){
                                            fieldDefinition.buttonText = updateFieldForm.findField('updateButtonText').getValue();
                                            fieldDefinition.vtype = 'file';
                                            // fieldDefinition.inputType = 'file'; // needed for fileSize validation but it causes some cosmetic problems
                                            // fieldDefinition.buttonConfig = {hidden: true};
                                        }

                                        if (selected_field.xtype == 'related_combobox'){
                                            fieldDefinition.editable = updateFieldForm.findField('updateEditable').getValue();
                                            fieldDefinition.forceSelection = updateFieldForm.findField('updateForceSelection').getValue();
                                            fieldDefinition.multiSelect = updateFieldForm.findField('updateMultiSelect').getValue();
                                            fieldDefinition.displayField = updateFieldForm.findField('updateDisplayField').getValue();
                                            fieldDefinition.fields = [
                                                { name: 'id' },
                                                { name: fieldDefinition.displayField }
                                            ];
                                            fieldDefinition.extraParams = {
                                                model: updateFieldForm.findField('updateRelatedModel').getValue(),
                                                displayField: fieldDefinition.displayField
                                            };
                                        }else if (selected_field.xtype == 'combobox' || selected_field.xtype == 'combo'){
                                            var updateOptions = updateFieldForm.findField('updateOptions').getValue();
                                            if(updateOptions){
                                                var options = updateOptions.split(',');
                                                var optionsArray = [], subArray = [], i = 1;
                                                Ext.each(options, function(option){
                                                    subArray.push(option.trim());
                                                    if (i%2 === 0){
                                                        optionsArray.push(subArray);
                                                        subArray = [];
                                                    }
                                                    i++;
                                                });

                                                fieldDefinition.store = optionsArray;
                                            }
                                            fieldDefinition.editable = updateFieldForm.findField('updateEditable').getValue();
                                            fieldDefinition.forceSelection = updateFieldForm.findField('updateForceSelection').getValue();
                                            fieldDefinition.multiSelect = updateFieldForm.findField('updateMultiSelect').getValue();
                                        }

                                        //console.log(fieldDefinition);

                                        // use getIndexOfFieldByName and splice to replace field in definition to preserve field order
                                        var indexOfField = formBuilder.getIndexOfFieldByName(formPanel, formPanel.selected_field.name);
                                        //console.log(indexOfField);

                                        formPanel.form_definition.splice(indexOfField, 1, fieldDefinition);
                                        //console.log(formPanel.form_definition);

                                        // reload form from definition
                                        formBuilder.reloadForm(formPanel);

                                        // re-highlight form item
                                        formPanel.getForm().findField(updateName).getEl().dom.click();
                                    }
                                  }
                                }
                              }
                            ],
                            defaults:{
                                width: 230,
                                labelWidth: 85
                            },
                            items:[]
                        },
                        {
                            xtype: 'form',
                            title: 'Form Properties',
                            itemId: 'form_props',
                            autoScroll: true,
                            bodyPadding: 10,             
                            defaults:{
                                width: 230,
                                labelWidth: 85
                            },
                            items:[{
                                    fieldLabel: 'Form Title',
                                    name: 'description',
                                    xtype: 'textfield',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Internal ID',
                                    name: 'internal_identifier',
                                    xtype: 'displayfield'
                                },
                                {
                                    fieldLabel: 'Widget Action',
                                    name: 'widget_action',
                                    xtype: 'combobox',
                                    width: 215,
                                    allowBlank: false,
                                    forceSelection:true,
                                    store: [
                                        ['email', 'Email Only'],
                                        ['save', 'Save Only'],
                                        ['both', 'Email & Save Data']
                                    ],
                                    listeners:{
                                        change:function(field, newValue, oldValue){
                                            var widget_email_recipients = field.findParentByType('form').getForm().findField('widget_email_recipients');
                                            widget_email_recipients.allowBlank = (field.getValue() == 'save');
                                        }
                                    },
                                    plugins: [new helpQtip("Configure the action to be taken when a form is submitted via Knitkit's Dynamic Forms Widget.<br /> Email Only will email but not save the data to the database.<br /> Save Only will save the data to the database but not email.<br /> Email & Save Data will do both.<br /> NOTE: The Contact Us Widget uses Knitkit's website configuration options for email behavior & not the Dynamic Forms Widget Action setting.")]
                                },
                                {
                                    fieldLabel: 'Email Recipients',
                                    name: 'widget_email_recipients',
                                    xtype: 'textfield',
                                    width: 215,
                                    listeners:{
                                        render:function(field){
                                            field.allowBlank = (field.findParentByType('form').getForm().findField('widget_action').getValue() == 'save');
                                        }
                                    },
                                    plugins: [new helpQtip('When Widget Action is set to Email only or Email & Save Data, this field is required. Enter a comma separated list of email addresses to receive data submitted with this form via the Knitkit Dynamic Forms widget.')]
                                },
                                {
                                    fieldLabel: 'Focus Field',
                                    name: 'focus_first_field',
                                    xtype: 'checkbox',
                                    width: 105,
                                    plugins: [new helpQtip('Do you want the cursor to autmatically focus the first form field? If there is text it will also automatically highlight.')]
                                },
                                {
                                    fieldLabel: 'Submit Button Label',
                                    name: 'submit_button_label',
                                    xtype: 'textfield',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Cancel Button Label',
                                    name: 'cancel_button_label',
                                    xtype: 'textfield',
                                    allowBlank: false
                                },
                                {
                                    fieldLabel: 'Submit Empty Text',
                                    name: 'submit_empty_text',
                                    xtype: 'checkbox',
                                    width: 105,
                                    plugins: [new helpQtip('Empty Text is example text. Do you want to submit these example values if they are unchanged by the user?')]
                                },
                                {
                                    fieldLabel: 'Message Target',
                                    name: 'msg_target',
                                    xtype: 'combobox',
                                    allowBlank: false,
                                    editable: true,
                                    forceSelection:false,
                                    value: 'qtip',
                                    store: [
                                        ['qtip', 'Quick Tip'],
                                        ['side', 'Right of Field'],
                                        ['title', 'Title'],
                                        ['under', 'Under Field'],
                                        ['none', 'None']
                                    ]
                                },
                                {
                                    fieldLabel: 'Comment',
                                    labelAlign: 'top',
                                    name: 'comment',
                                    xtype: 'textarea'
                                },
                                {
                                    fieldLabel: 'Created At',
                                    name: 'created_at',
                                    xtype: 'displayfield'
                                },
                                {
                                    fieldLabel: 'Created By',
                                    name: 'created_by',
                                    xtype: 'displayfield'
                                },
                                {
                                    fieldLabel: 'Updated At',
                                    name: 'updated_at',
                                    xtype: 'displayfield'
                                },
                                {
                                    fieldLabel: 'Updated By',
                                    name: 'updated_by',
                                    xtype: 'displayfield'
                                }
                            ]
                        }
                    ]
                }
            ]
            
        }, config);

        this.callParent([config]);
    }
});