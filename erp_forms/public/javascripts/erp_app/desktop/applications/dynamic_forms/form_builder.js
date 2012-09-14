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
            text: 'Text Field',
            leaf: true,
            field_xtype: 'textfield',
            fieldLabel: 'Label'
        },
        {
            text: 'Text Area',
            leaf: true,
            field_xtype: 'textarea',
            fieldLabel: 'Label'
        }
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

    getIndexOfFieldByName : function(formPanel, fieldName){
        i=0;

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
        //console.log(formPanel.form_definition);

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
                    var east_tabs = Ext.getCmp('east_tabs_'+(Compass.ErpApp.Utility.isBlank(formPanel.form_id) ? 'new' : formPanel.form_id));
                    east_tabs.setActiveTab(1);

                    formPanel.selected_field = item;

                    //TODO: populate field properties
                    var prop_form = east_tabs.query('#field_props').first().getForm();
                    prop_form.findField('updateName').setValue(item.name);
                    prop_form.findField('updateLabel').setValue(item.fieldLabel);
                }
            });
        });
    },

    constructor : function(config) {
        if (Compass.ErpApp.Utility.isBlank(config.form_definition)){
            config.form_definition = [];
        }

        config = Ext.apply({
            layout:'border',
            title: config.title || 'New Form',
            border: false,
            closable: true,
            autoHeight:true,
            //iconCls:'icon-document',
            buttonAlign:'center',
            items: [{
                    xtype: 'form',
                    id: 'formBuilder_'+(Compass.ErpApp.Utility.isBlank(config.form_id) ? config.title : config.form_id),
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

                                            var fieldDefinition = {
                                                fieldLabel: droppedField.get('fieldLabel'),
                                                xtype: droppedField.get('field_xtype'),
                                                name: field_name
                                            };
                                            formPanel.findParentByType('dynamic_forms_FormBuilder').addFieldToForm(formPanel, fieldDefinition);

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
                    id: 'east_tabs_'+(Compass.ErpApp.Utility.isBlank(config.form_id) ? 'new' : config.form_id),
                    region: 'east',
                    width: 250,
                    activeTab: 0,
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
                            width: 250,
                            root: fieldTreeRootNode
                        },
                        {
                            xtype: 'form',
                            title: 'Field Properties',
                            itemId: 'field_props',
                            width: 250,
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
                                        var formPanel = Ext.getCmp('formBuilder_'+(Compass.ErpApp.Utility.isBlank(config.form_id) ? config.title : config.form_id));
                                        var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                                        var updateLabelField = updateFieldForm.getForm().findField('updateLabel');
                                        var updateNameField = updateFieldForm.getForm().findField('updateName');

                                        // build field json
                                        var fieldDefinition = {
                                            fieldLabel: updateLabelField.getValue(),
                                            xtype: formPanel.selected_field.xtype,
                                            name: updateNameField.getValue()
                                        };
                                        //console.log(fieldDefinition);

                                        // use getIndexOfFieldByName and splice to replace field in definition to preserve field order
                                        var indexOfField = formBuilder.getIndexOfFieldByName(formPanel, formPanel.selected_field.name);
                                        //console.log(indexOfField);

                                        formPanel.form_definition.splice(indexOfField, 1, fieldDefinition);
                                        //console.log(formPanel.form_definition);

                                        // addFieldToForm will reload fields in form from definition
                                        formBuilder.addFieldToForm(formPanel);

                                        // re-highlight form item
                                        console.log('re-highlight');
                                        formPanel.getForm().findField(updateNameField.getValue()).getEl().dom.click();
                                    }
                                  }
                                }
                              }
                            ],
                            defaults:{
                                width: 200,
                                allowBlank: false
                            },
                            items:[
                                {
                                    fieldLabel: 'Field Label',
                                    name: 'updateLabel',
                                    xtype: 'textfield'
                                },
                                {
                                    fieldLabel: 'Field Name',
                                    name: 'updateName',
                                    xtype: 'textfield'
                                }
                            ]
                        },
                        {
                            xtype: 'form',
                            title: 'Form Properties',
                            itemId: 'form_props',
                            width: 250,
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

