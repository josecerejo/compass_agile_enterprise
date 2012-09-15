Ext.define('Field', {
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
    model: 'Field',
    proxy: {
        type: 'memory'
    },
    folderSort: true
});

var fieldData = {
    text:"Fields",
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
            text: 'Number Field',
            field_xtype: 'numberfield',
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
    ]};

var fieldTreeRootNode = fieldStore.setRootNode(fieldData);

Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.FormBuilder",{
    extend:"Ext.container.Container",
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
        console.log(xtype);
        var common = [
            {
                fieldLabel: 'Label',
                name: 'updateLabel',
                xtype: 'textfield',
                allowBlank: false
            },
            {
                fieldLabel: 'Name',
                name: 'updateName',
                xtype: 'textfield',
                allowBlank: false
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
                fieldLabel: 'Label Width',
                name: 'updateLabelWidth',
                xtype: 'numberfield'
            }
        ];

        var combobox = [
            {
                fieldLabel: 'Force Selection',
                name: 'updateForceSelection',
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

        var result = common;
        switch(xtype){
            case 'combo':
              result = result.concat(combobox);
              break;
            case 'combobox':
              result = result.concat(combobox);
              break;
            case 'textfield':
              result = result.concat(minMaxLength);
              break;
            case 'textarea':
              result = result.concat(minMaxLength);
              break;
            case 'numberfield':
              result = result.concat(numberMinMaxValue);
              break;
            case 'datefield':
              result = result.concat(dateMinMaxValue);
              break;
            case 'timefield':
              result = result.concat(timeMinMaxValue);
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

    addFieldToForm : function(formPanel, fieldDefinition){
        if (fieldDefinition){
            formPanel.form_definition.push(fieldDefinition);
        }
        formPanel.removeAll();
        var items = formPanel.add(formPanel.form_definition);

        // add listener to highlight selected field
        Ext.each(items, function(item){
            item.getEl().addListener('click', function(){    
                var highlight_border = '1px solid green';            
                if (item.getEl().getStyle('border') != highlight_border){
                    Ext.each(items, function(i){
                        if (item != i && i.getEl().getStyle('border') == highlight_border){
                            var label = i.getEl().query('label').first();
                            label.style.width = (parseInt(label.style.width) + 2) + 'px';
                            i.getEl().setStyle('border', 'none');
                        }
                    });
                    var label = item.getEl().query('label').first();
                    label.style.width = (parseInt(label.style.width) - 2) + 'px';
                    item.getEl().setStyle('border', highlight_border);

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
                    prop_form.findField('updateAllowBlank').setValue(item.allowBlank);
                    prop_form.findField('updateDisplayInGrid').setValue(item.display_in_grid);
                    prop_form.findField('updateReadOnly').setValue(item.readOnly);
                    prop_form.findField('updateWidth').setValue(item.width);
                    prop_form.findField('updateLabelWidth').setValue(item.labelWidth);

                    if (item.xtype == 'datefield' || item.xtype == 'timefield' || item.xtype == 'numberfield'){
                        prop_form.findField('updateMinValue').setValue(item.minValue);
                        prop_form.findField('updateMaxValue').setValue(item.maxValue);
                    }

                    if (item.xtype == 'textfield' || item.xtype == 'textarea'){
                        prop_form.findField('updateMinLength').setValue(item.minLength);
                        prop_form.findField('updateMaxLength').setValue(item.maxLength);
                    }

                    if (item.xtype == 'combobox' || item.xtype == 'combo'){
                        prop_form.findField('updateForceSelection').setValue(item.forceSelection);
                    }
                }
            });
        });

        // highlight newly added field
        if (fieldDefinition){
            formPanel.getForm().findField(fieldDefinition.name).getEl().dom.click();
        }
    },

    constructor : function(config) {
        if (Compass.ErpApp.Utility.isBlank(config.form_definition)){
            config.form_definition = [];
        }

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
                    form_id: (Compass.ErpApp.Utility.isBlank(config.form_id) ? null : config.form_id),
                    tbar: [
                      { xtype: 'button', 
                        text: 'Save Form',
                        iconCls: 'icon-save',
                        listeners:{
                          click: function(button){
                            var formPanel = button.findParentByType('form');
                            var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');

                            if (Compass.ErpApp.Utility.isBlank(config.form_id)){
                                var url = '/erp_forms/erp_app/desktop/dynamic_forms/forms/create';
                            }else{                                
                                var url = '/erp_forms/erp_app/desktop/dynamic_forms/forms/update';
                            }

                            var self = this;
                            formBuilder.setWindowStatus('Saving form ...');
                            Ext.Ajax.request({
                              url: url,
                              method: 'POST',
                              params:{
                                id:config.form_id,
                                form_definition:Ext.JSON.encode(formPanel.form_definition),
                                description: config.title,
                                model_name: config.model_name
                              },
                              success: function(response) {
                                formBuilder.clearWindowStatus();
                                var obj =  Ext.decode(response.responseText);
                                if(obj.success){
                                    if (Compass.ErpApp.Utility.isBlank(config.form_id)){
                                        // refresh model tree
                                        Ext.getStore('formsTreeStore').load();
                                    }                                    
                                    config.form_id = obj.id;
                                    formPanel.form_id = obj.id;
                                    Ext.Msg.alert('Success', 'Form saved.');  
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
                      }
                    ],
                    listeners:{
                        render:function(formPanel){
                            formPanel.findParentByType('dynamic_forms_FormBuilder').addFieldToForm(formPanel);
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
                                                fieldLabel: field_name,
                                                display_in_grid: true
                                            };
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
                            xtype: 'treepanel',
                            viewConfig: {
                                plugins: {
                                    ptype: 'treeviewdragdrop',
                                    ddGroup: 'fieldsDDGroup',
                                    enableDrop: false
                                }
                            },                            
                            id: 'availableFields',                            
                            title: 'Field Types',
                            root: fieldTreeRootNode
                        },
                        {
                            xtype: 'form',
                            title: 'Field Properties',
                            itemId: 'field_props',
                            bodyPadding: 10,
                            tbar: [
                              { xtype: 'button', 
                                text: 'Update Field',
                                iconCls: 'icon-edit',

                                listeners:{
                                  click: function(button){
                                    // get formPanel
                                    var updateFieldForm = button.findParentByType('form');
                                    if (updateFieldForm.getForm().isValid()){
                                        var formPanel = Ext.getCmp('formBuilder_'+config.title).query('#dynamicForm').first();
                                        var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                                        var updateLabelField = updateFieldForm.getForm().findField('updateLabel');
                                        var updateNameField = updateFieldForm.getForm().findField('updateName');
                                        var updateWidth = updateFieldForm.getForm().findField('updateWidth');
                                        var updateLabelWidth = updateFieldForm.getForm().findField('updateLabelWidth');
                                        var updateReadOnly = updateFieldForm.getForm().findField('updateReadOnly');
                                        var updateAllowBlank = updateFieldForm.getForm().findField('updateAllowBlank');
                                        var updateDisplayInGrid = updateFieldForm.getForm().findField('updateDisplayInGrid');

                                        // build field json
                                        var fieldDefinition = {
                                            xtype: formPanel.selected_field.xtype,
                                            name: updateNameField.getValue(),
                                            fieldLabel: updateLabelField.getValue()
                                        };

                                        if (updateLabelWidth.getValue()){
                                            fieldDefinition.labelWidth = updateLabelWidth.getValue();
                                        }
                                        if (updateWidth.getValue()){
                                            fieldDefinition.width = updateWidth.getValue();
                                        }
                                        if (updateReadOnly.getValue()){
                                            fieldDefinition.readOnly = updateReadOnly.getValue();
                                        }
                                        if (updateAllowBlank.getValue()){
                                            fieldDefinition.allowBlank = updateAllowBlank.getValue();
                                        }
                                        if (updateDisplayInGrid.getValue()){
                                            fieldDefinition.display_in_grid = updateDisplayInGrid.getValue();
                                        }

                                        console.log(fieldDefinition);

                                        // use getIndexOfFieldByName and splice to replace field in definition to preserve field order
                                        var indexOfField = formBuilder.getIndexOfFieldByName(formPanel, formPanel.selected_field.name);
                                        //console.log(indexOfField);

                                        formPanel.form_definition.splice(indexOfField, 1, fieldDefinition);
                                        //console.log(formPanel.form_definition);

                                        // addFieldToForm will reload fields in form from definition
                                        formBuilder.addFieldToForm(formPanel);

                                        // re-highlight form item
                                        formPanel.getForm().findField(updateNameField.getValue()).getEl().dom.click();
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
                            bodyPadding: 10,
                            items:[
                                {
                                    fieldLabel: 'Form Name',
                                    xtype: 'textfield',
                                    width: 200
                                }
                            ]
                        }
                    ]
                }
            ],
            buttons: [{
                text:'Submit',
                listeners:{
                    'click':function(button){
                        var win = button.findParentByType('dynamic_forms_form_builer');
                        var formPanel = win.findByType('form')[0];
                        formPanel.getForm().submit({
                            method:'POST',
                            waitMsg:'Publishing...',
                            success:function(form, action){
                                var response =  Ext.util.JSON.decode(action.response.responseText);
                                win.fireEvent('publish_success', win, response);
                                win.close();
                            },
                            failure:function(form, action){
                                var response =  Ext.util.JSON.decode(action.response.responseText);
                                win.fireEvent('publish_failure', win, response);
                                win.close();
                            }
                        });
                    }
                }
            },
            {
                text: 'Cancel',
                listeners:{
                    'click':function(button){
                        var win = button.findParentByType('dynamic_forms_form_builer');
                        var form = win.findByType('form')[0];
                        form.getForm().reset();
                        win.close();
                    }
                }
            }]
        }, config);

        this.callParent([config]);
    }
    
});

