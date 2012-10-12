Ext.define('DynamicForm', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'id', type: 'number'},
    {name: 'description', type: 'string'},
    {name: 'model_name', type: 'string'},
    {name: 'definition', type: 'string'},
    {name: 'internal_identifier', type: 'string'},
    {name: 'email_or_save', type: 'string'},
    {name: 'email_recipients', type: 'string'},
    {name: 'focus_first_field', type: 'boolean'},
    {name: 'show_in_multitask', type: 'boolean'},
    {name: 'submit_empty_text', type: 'boolean'},
    {name: 'submit_button_label', type: 'string'},
    {name: 'cancel_button_label', type: 'string'},
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
      Ext.getCmp('westregionPanel').openFormTab(record);
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

    getFieldOptionsForXtype : function(xtype){
        //console.log(xtype);
        var common = [
            {
                fieldLabel: 'Name',
                name: 'updateName',
                xtype: 'textfield',
                allowBlank: false
            },
            {
                fieldLabel: 'Label',
                name: 'updateLabel',
                xtype: 'textfield',
                allowBlank: false
            },
            {
                fieldLabel: 'Default Value',
                name: 'updateValue',
                xtype: 'textfield'
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
                fieldLabel: 'Label Width',
                name: 'updateLabelWidth',
                xtype: 'numberfield'
            }
        ];

        var combobox = [
            {
                fieldLabel: 'Options',
                name: 'updateOptions',
                xtype: 'textarea',
                labelWidth: 50,
                width: 235,
                height: 175,
                toolTip: "Add options with a comma separated list. Example: value,Description,option2,Option 2"
            },
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
                    ['function','Custom Function']
                ],
                value: 'none',
                forceSelection: true,
                allowBlank: false,
                listeners:{
                    change: function(field, newValue, oldValue, eOpts){
                        var field_props = this.findParentByType('form');
                        var updateValidationRegex = field_props.getForm().findField('updateValidationRegex');
                        var updateValidationFunction = field_props.getForm().findField('updateValidationFunction');
                        if (newValue == 'regex'){
                            updateValidationRegex.show();
                            updateValidationRegex.enable();
                            updateValidationFunction.hide();
                            updateValidationFunction.disable();
                        }else if (newValue == 'function'){
                            updateValidationFunction.show();
                            updateValidationFunction.enable();
                            updateValidationRegex.hide();
                            updateValidationRegex.disable();
                        }else{
                            updateValidationFunction.hide();
                            updateValidationFunction.disable();
                            updateValidationRegex.hide();
                            updateValidationRegex.disable();
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
                fieldLabel: 'Function',
                name: 'updateValidationFunction',
                xtype: 'textfield',
                allowBlank: true,
                hidden: true,
                disabled: true,
                emptyText: 'customFunction(v)'
            }
        ];

        var result = common;
        switch(xtype){
            case 'combo':
              result = result.concat(combobox);
              break;
            case 'combobox':
              result = result.concat(combobox);
              break;
            case 'email':
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
            case 'numberfield':
              result = result.concat(minMaxLength);
              result = result.concat(numberMinMaxValue);              
              result = result.concat(validation);
              break;
            case 'password':
              result = result.concat(minMaxLength);
              result = result.concat(validation);
              break;
            case 'datefield':
              result = result.concat(dateMinMaxValue);
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
            if (direction == 'up' && idx == 0){
                Ext.Msg.alert('Error', 'Cannot move. Field is already at top.');
            }else if (direction == 'down' && idx == (formPanel.form_definition.length-1)){
                Ext.Msg.alert('Error', 'Cannot move. Field is already at bottom.');
            }else{
                var new_index = (direction == 'up' ? idx-1 : idx+1)
                formPanel.form_definition.splice(idx, 1); // remove field from definition
                formPanel.form_definition.splice(new_index, 0, field_in_definition); // add field to definition
                formPanel.findParentByType('dynamic_forms_FormBuilder').reloadForm(formPanel); // redraw form from definition
                formPanel.getForm().findField(formPanel.selected_field.name).getEl().dom.click(); // highlight selected field
            }
        }
    },

    emailRegex : function(){
        return ErpApp.emailRegex;
    },

    addFieldToForm : function(formPanel, fieldDefinition){
        if (fieldDefinition){
            formPanel.form_definition.push(fieldDefinition);
        }

        this.reloadForm(formPanel);

        // highlight newly added field
        if (fieldDefinition){
            formPanel.getForm().findField(fieldDefinition.name).getEl().dom.click();
        }
    },

    addValidationToForm : function(formPanel){
        var form_with_validation = Ext.clone(formPanel.form_definition); // make independent copy
        Ext.each(form_with_validation, function(field){
            if(!Ext.isEmpty(field.validator_function)){
                field.validator = function(v){ regex = this.initialConfig.validation_regex; return eval(field.validator_function); };
            }else if (!Ext.isEmpty(field.validation_regex)){
                field.validator = function(v){ return validate_regex(v, this.initialConfig.validation_regex); };
            }
            //form_with_validation.push(field);
        });

        return form_with_validation;
    },

    addHighlightListenerForSelectedField : function(form_with_validation){
        var form_with_listeners = [];
        Ext.each(form_with_validation, function(field){
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
                                    label.style.width = (parseInt(label.style.width) + 2) + 'px';
                                    i.getEl().setStyle('border', 'none');
                                }
                            });
                            var label = el.query('label').first();
                            label.style.width = (parseInt(label.style.width) - 2) + 'px';
                            el.setStyle('border', highlight_border);
                            el.highlight();

                            // set field properties as active tab
                            var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                            var east_tabs = formBuilder.query('#east_tabs').first();
                            east_tabs.setActiveTab('field_props');

                            formPanel.selected_field = item;

                            //TODO: populate field properties
                            var prop_formPanel = east_tabs.query('#field_props').first();
                            var prop_form = prop_formPanel.getForm();
                            prop_formPanel.removeAll();
                            prop_formPanel.add(formBuilder.getFieldOptionsForXtype(item.xtype));                    

                            // common
                            prop_form.findField('updateName').setValue(item.name);
                            prop_form.findField('updateLabel').setValue(item.fieldLabel);
                            prop_form.findField('updateValue').setValue(item.value);
                            prop_form.findField('updateEmptyText').setValue(item.emptyText);
                            prop_form.findField('updateAllowBlank').setValue(item.allowBlank);
                            prop_form.findField('updateDisplayInGrid').setValue(item.display_in_grid);
                            prop_form.findField('updateReadOnly').setValue(item.readOnly);
                            prop_form.findField('updateWidth').setValue(item.width);
                            prop_form.findField('updateHeight').setValue(item.height);
                            prop_form.findField('updateLabelWidth').setValue(item.labelWidth);

                            if (item.xtype == 'datefield' || item.xtype == 'timefield'){
                                prop_form.findField('updateMinValue').setValue(item.minValue);
                                prop_form.findField('updateMaxValue').setValue(item.maxValue);
                            } 

                            if (!Ext.isEmpty(item.validation_regex)){
                                prop_form.findField('updateValidationType').setValue('regex');
                                prop_form.findField('updateValidationRegex').show();
                                prop_form.findField('updateValidationRegex').enable();
                                prop_form.findField('updateValidationRegex').setValue(item.validation_regex);
                            }else if(!Ext.isEmpty(item.validator_function)){
                                prop_form.findField('updateValidationType').setValue('function');
                                prop_form.findField('updateValidationFunction').show();
                                prop_form.findField('updateValidationFunction').enable();
                                prop_form.findField('updateValidationFunction').setValue(item.validator_function);                        
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

                            if (item.xtype == 'combobox' || item.xtype == 'combo'){
                                var options = Ext.encode(item.getStore().proxy.reader.rawData).replace(/\"/g,'').replace(/\[/g,'').replace(/\]/g,'');
                                prop_form.findField('updateOptions').setValue(options);
                                prop_form.findField('updateEditable').setValue(item.editable);
                                prop_form.findField('updateForceSelection').setValue(item.forceSelection);
                                prop_form.findField('updateMultiSelect').setValue(item.multiSelect);
                            }
                        }
                    });
                }
            }
            form_with_listeners.push(field);
        });

        return form_with_listeners;
    },

    reloadForm : function(formPanel){
        formPanel.removeAll();
        var form_with_validation = this.addValidationToForm(formPanel);
        formPanel.add(this.addHighlightListenerForSelectedField(form_with_validation));        
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
            //iconCls:'icon-document',
            buttonAlign:'center',
            items: [{
                    xtype: 'form',
                    itemId: 'dynamicForm',
                    region: 'center',
                    autoScroll: true,
                    bodyPadding: 10,
                    form_definition: config.form_definition,
                    form_id: (Ext.isEmpty(config.form_id) ? null : config.form_id),
                    tbar: [
                      { xtype: 'button', 
                        text: 'Save Form',
                        iconCls: 'icon-save',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                            var form_props = formBuilder.query('#form_props').first().getForm();

                            //TODO: add validation for form_props including email_recipients which depends on email_or_save

                            if (Ext.isEmpty(config.form_id)){
                                var create = true;
                                var url = '/erp_forms/erp_app/desktop/dynamic_forms/forms/create';
                            }else{                                
                                var url = '/erp_forms/erp_app/desktop/dynamic_forms/forms/update';
                            }
                            formBuilder.setWindowStatus('Saving form ...');
                            Ext.Ajax.request({
                              url: url,
                              method: 'POST',
                              params:{
                                id:config.form_id,
                                form_definition:Ext.JSON.encode(formPanel.form_definition),
                                description: form_props.findField('description').getValue(),
                                model_name: config.model_name,
                                email_or_save: form_props.findField('email_or_save').getValue(),
                                email_recipients: form_props.findField('email_recipients').getValue(),
                                focus_first_field: form_props.findField('focus_first_field').getValue(),
                                show_in_multitask: form_props.findField('show_in_multitask').getValue(),
                                submit_empty_text: form_props.findField('submit_empty_text').getValue(),
                                submit_button_label: form_props.findField('submit_button_label').getValue(),
                                cancel_button_label: form_props.findField('cancel_button_label').getValue()
                              },
                              success: function(response) {
                                formBuilder.clearWindowStatus();
                                var obj =  Ext.decode(response.responseText);
                                if(obj.success){
                                    if (create == true){
                                        Ext.getCmp('dynamic_formsTabPanel').remove(formBuilder);
                                        Ext.getStore('dynamicFormStore').load({ params:{ id: obj.id } });
                                        Ext.getStore('formsTreeStore').load();
                                    }else{
                                        formBuilder.setTitle(form_props.findField('description').getValue());
                                        Ext.Msg.alert('Success', 'Form saved.');  
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
                                                fieldLabel: field_name.titleize(),
                                                display_in_grid: true
                                            };

                                            switch(fieldDefinition.xtype){
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
                                                    fieldDefinition.validation_regex = formBuilder.emailRegex();
                                                    break;
                                                case 'password':
                                                    fieldDefinition.xtype = 'textfield';
                                                    fieldDefinition.inputType = 'password';
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
                                    
                                    //alert(droppedField.get('text'));

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
                    width: 255,
                    activeTab: 0,
                    defaults:{
                        width: 255,
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
                                        var updateLabel = updateFieldForm.findField('updateLabel').getValue();
                                        var updateName = updateFieldForm.findField('updateName').getValue();
                                        var updateValue = updateFieldForm.findField('updateValue').getValue();
                                        var updateWidth = updateFieldForm.findField('updateWidth').getValue();
                                        var updateHeight = updateFieldForm.findField('updateHeight').getValue();
                                        var updateLabelWidth = updateFieldForm.findField('updateLabelWidth').getValue();
                                        var updateReadOnly = updateFieldForm.findField('updateReadOnly').getValue();
                                        var updateAllowBlank = updateFieldForm.findField('updateAllowBlank').getValue();
                                        var updateEmptyText = updateFieldForm.findField('updateEmptyText').getValue();
                                        var updateDisplayInGrid = updateFieldForm.findField('updateDisplayInGrid').getValue();

                                        var selected_field = formPanel.selected_field;

                                        // build field json
                                        var fieldDefinition = {
                                            xtype: selected_field.xtype,
                                            name: updateName,
                                            fieldLabel: updateLabel,
                                            readOnly: updateReadOnly,
                                            emptyText: updateEmptyText,
                                            allowBlank: updateAllowBlank,
                                            display_in_grid: updateDisplayInGrid
                                        };

                                        if (!Ext.isEmpty(updateValue)) fieldDefinition.value = updateValue;                                        
                                        if (!Ext.isEmpty(updateLabelWidth)) fieldDefinition.labelWidth = updateLabelWidth;                                        
                                        if (!Ext.isEmpty(updateWidth)) fieldDefinition.width = updateWidth;
                                        if (!Ext.isEmpty(updateHeight)) fieldDefinition.height = updateHeight;
                                        
                                        if (selected_field.xtype != 'combobox' && selected_field.xtype != 'combo'){
                                            switch(updateFieldForm.findField('updateValidationType').getValue()){
                                                case 'regex':
                                                    fieldDefinition.validation_regex = updateFieldForm.findField('updateValidationRegex').getValue();
                                                    break;
                                                case 'function':
                                                    fieldDefinition.validator_function = updateFieldForm.findField('updateValidationFunction').getValue();
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

                                        if (selected_field.xtype == 'combobox' || selected_field.xtype == 'combo'){
                                            var updateOptions = updateFieldForm.findField('updateOptions').getValue();
                                            if(updateOptions){
                                                var options = updateOptions.split(',');
                                                var optionsArray = [], subArray = [], i = 1;
                                                Ext.each(options, function(option){
                                                    subArray.push(option.trim());
                                                    if (i%2==0){
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
                            items:[
                                {
                                    fieldLabel: 'Form Name',
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
                                    fieldLabel: 'Email or Save Data',
                                    name: 'email_or_save',
                                    xtype: 'combobox',
                                    allowBlank: false,
                                    forceSelection:true,
                                    store: [
                                        ['email', 'Email Data'],
                                        ['save', 'Save Data'],
                                        ['both', 'Email & Save Data']
                                    ]
                                },
                                {
                                    fieldLabel: 'Email Recipients',
                                    name: 'email_recipients',
                                    xtype: 'textfield'
                                },
                                {
                                    fieldLabel: 'Focus Field',
                                    name: 'focus_first_field',
                                    xtype: 'checkbox'
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
                                    xtype: 'checkbox'
                                },
                                {
                                    fieldLabel: 'Show in MultiTask',
                                    name: 'show_in_multitask',
                                    xtype: 'checkbox'
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
