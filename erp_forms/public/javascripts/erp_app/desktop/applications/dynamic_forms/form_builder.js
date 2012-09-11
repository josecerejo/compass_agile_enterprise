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

    addFieldToForm : function(formPanel, fieldDefinition){
        if (fieldDefinition){
            formPanel.form_definition.push(fieldDefinition);
        }
        formPanel.removeAll();
        formPanel.add(formPanel.form_definition);
        //console.log(formPanel.form_definition);

        Ext.each(formPanel.items, function(){
            //x-form-item
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
                    id: 'formBuilder_'+config.title,
                    region: 'center',
                    bodyPadding: 10,
                    form_definition: config.form_definition,
                    tbar: [
                      { xtype: 'button', 
                        text: 'Save',
                        iconCls: 'icon-save',
                        listeners:{
                          click: function(){
                            var formPanel = Ext.getCmp('formBuilder_'+config.title);
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
                                    // console.log(droppedField.get('field_xtype'));
                                    // console.log(droppedField.get('text'));
                                    var fieldDefinition = {
                                        fieldLabel: droppedField.get('fieldLabel'),
                                        xtype: droppedField.get('field_xtype'),
                                        name: 'fieldname'                                        
                                    };
                                    formPanel.findParentByType('dynamic_forms_FormBuilder').addFieldToForm(formPanel, fieldDefinition);
                                    
                                    //alert(droppedField.get('text'));

                                    return true;
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'tabpanel',
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
                            xtype: 'panel',
                            title: 'Form Properties',
                            width: 250
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

