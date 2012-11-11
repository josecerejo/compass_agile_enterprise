Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.WestRegion",{
  extend:"Ext.tab.Panel",
  alias:'widget.dynamic_forms_westregion',
  setWindowStatus : function(status){
    this.findParentByType('statuswindow').setStatus(status);
  },
    
  clearWindowStatus : function(){
    this.findParentByType('statuswindow').clearStatus();
  },

  deleteModel : function(node){
    var self = this;
    Ext.MessageBox.confirm('Confirm',
      'Are you sure you want to delete this dynamic form model? WARNING: All forms belonging to this model will be deleted and any/all data will be orphaned!',
      function(btn){
        if(btn == 'no'){
          return false;
        }
        else if(btn == 'yes')
        {
          self.setWindowStatus('Deleting Dynamic Model...');
          Ext.Ajax.request({
            url: '/erp_forms/erp_app/desktop/dynamic_forms/models/delete',
            method: 'POST',
            params:{
              id:node.data.formModelId
            },
            success: function(response) {
              self.clearWindowStatus();
              var obj =  Ext.decode(response.responseText);
              if(obj.success){
                //node.remove(true); // remove node causing a reload of entire tree with error, so we are going to simply reload tree for now
                self.formsTree.getStore().load({
                  node: self.formsTree.getRootNode()
                });
              }
              else{
                Ext.Msg.alert('Error', 'Error deleting model');
              }
            },
            failure: function(response) {
              self.clearWindowStatus();
              Ext.Msg.alert('Error', 'Error deleting model');
            }
          });
        }
      });
  },

  deleteForm : function(node){
    var self = this;
    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this form? WARNING: Data will be orphaned if there is no form for this model.', function(btn){
      if(btn == 'no'){
        return false;
      }
      else
      if(btn == 'yes')
      {
        self.setWindowStatus('Deleting form...');
        Ext.Ajax.request({
          url: '/erp_forms/erp_app/desktop/dynamic_forms/forms/delete',
          method: 'POST',
          params:{
            id:node.data.formId
          },
          success: function(response) {
            self.clearWindowStatus();
            var obj =  Ext.decode(response.responseText);
            if(obj.success){
              node.remove(false);
            }
            else{
              Ext.Msg.alert('Error', 'Error deleting form');
            }
          },
          failure: function(response) {
            self.clearWindowStatus();
            Ext.Msg.alert('Error', 'Error deleting form');
          }
        });
      }
    });
  },

  setDefaultForm : function(node){
    var self = this;
    self.setWindowStatus('Setting Default form...');
    Ext.Ajax.request({
      url: '/erp_forms/erp_app/desktop/dynamic_forms/models/set_default_form',
      method: 'POST',
      params:{
        id:node.data.formId,
        model_name:node.data.formModelName
      },
      success: function(response) {
        self.clearWindowStatus();
        var obj =  Ext.decode(response.responseText);
        if(obj.success){
          //reload model tree node
          self.formsTree.getStore().load({
            //                        node:node.parentNode
            });
          //node.parentNode.expand();
        }
        else{
          Ext.Msg.alert('Error', 'Error setting default form');
        }
      },
      failure: function(response) {
        self.clearWindowStatus();
        Ext.Msg.alert('Error', 'Error setting default form');
      }
    });
  },

  addDynamicForm : function(record){
    var self = this;

    var newFormWindow = Ext.create("Ext.window.Window",{
              layout:'fit',
              width:375,
              title:'New Dynamic Form',
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
                  fieldLabel:'Form Title',
                  allowBlank:false,
                  name:'form_name',
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
                    var formPanel = window.query('form')[0];
                    var form_name = formPanel.getForm().findField('form_name').getValue();

                    var form_tab = Ext.getCmp('formBuilder_'+form_name);
                    if (form_tab){
                      this.centerRegion.workArea.setActiveTab(form_tab);
                      return;
                    }

                    var formBuilder = Ext.create('Compass.ErpApp.Desktop.Applications.DynamicForms.FormBuilder', {
                      title: form_name,
                      model_name: record.get('text')
                    });
                    self.centerRegion.workArea.add(formBuilder);
                    self.centerRegion.workArea.setActiveTab(self.centerRegion.workArea.items.length - 1);

                    var form_props = formBuilder.query('#form_props').first().getForm();
                    form_props.findField('description').setValue(form_name);
                    form_props.findField('widget_action').setValue('save');
                    form_props.findField('submit_button_label').setValue('Submit');
                    form_props.findField('cancel_button_label').setValue('Cancel');
                    Ext.getCmp('dynamic_forms_westregion').setActiveTab('field_types');
                    var east_tabs = formBuilder.query('#east_tabs').first();
                    east_tabs.setActiveTab('form_props');

                    newFormWindow.close();
                  }
                }
              },
              {
                text: 'Close',
                handler: function(){
                  newFormWindow.close();
                }
              }]
            });
            newFormWindow.show();
  },

  configureFormModel : function(record){
    var self = this;

    var configureModelWindow = Ext.create("Ext.window.Window",{
      layout:'fit',
      width:375,
      title:'Configure Dynamic Form Model',
      plain: true,
      buttonAlign:'center',
      items: Ext.create("Ext.form.Panel",{
        labelWidth: 110,
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        url:'/erp_forms/erp_app/desktop/dynamic_forms/models/update',
        defaults: {
          width: 225
        },
        items: [
        {
          xtype:'combobox',
          fieldLabel:'File Security Default',
          allowBlank:false,
          name:'file_security_default',
          value: record.get('file_security_default'),
          store:[
            ['private','Private'],
            ['public','Public']
          ]
        }]
      }),
      buttons: [{
        text:'Submit',
        listeners:{
          'click':function(button){
            var formPanel = button.findParentByType('window').query('form').first();
            self.setWindowStatus('Updating dynamic form model ...');
            if (formPanel.getForm().isValid()){
              formPanel.getForm().submit({
                params:{
                  id: record.get("formModelId")
                },
                success:function(form, action){
                  self.clearWindowStatus();
                  var obj =  Ext.decode(action.response.responseText);
                  if(obj.success){
                    self.formsTree.getStore().load({
                      node: self.formsTree.getRootNode()
                    });
                    configureModelWindow.close();
                  }else{
                    Ext.Msg.alert("Error", obj.message);
                  }
                },
                failure:function(form, action){
                  self.clearWindowStatus();
                  var obj =  Ext.decode(action.response.responseText);
                  if(obj !== null){
                    Ext.Msg.alert("Error", obj.message);
                  }else{
                    Ext.Msg.alert("Error", "Error updating form model");
                  }
                }
              });              
            }
          }
        }
      },{
        text: 'Close',
        handler: function(){
          configureModelWindow.close();
        }
      }]
    });
    configureModelWindow.show();
  },

  openFormTab : function(record){
    var formBuilder = Ext.create('Compass.ErpApp.Desktop.Applications.DynamicForms.FormBuilder', {
      title: record.get('description'),
      model_name: record.get('model_name'),
      form_id: record.get('id'),
      form_definition: Ext.decode(record.get('definition')),
      msg_target: record.get('msg_target')
    });
    this.centerRegion.workArea.add(formBuilder);
    this.centerRegion.workArea.setActiveTab(this.centerRegion.workArea.items.length - 1);

    var form_props = formBuilder.query('#form_props').first().getForm();
    form_props.loadRecord(record);
    Ext.getCmp('dynamic_forms_westregion').setActiveTab('field_types');
    var east_tabs = formBuilder.query('#east_tabs').first();
    east_tabs.setActiveTab('form_props');
  },

  getDynamicForm : function(record){
    var self = this;
    form_tab = Ext.getCmp('formBuilder_'+record.get('text'));

    if (form_tab){
      this.centerRegion.workArea.setActiveTab(form_tab);
      return;
    }

    self.setWindowStatus('Loading dynamic form...');
    Ext.getStore('dynamicFormStore').load({ params:{ id:record.get('formId') }});
    self.clearWindowStatus();
  },

  getDynamicData : function(record, title){
    var self = this;
    dynamic_data = Ext.getCmp('centerRegionLayout_'+record.data.text);
    if (dynamic_data){
      this.centerRegion.workArea.setActiveTab(dynamic_data);
      return;
    }

    var centerRegionLayout = Ext.create("Ext.panel.Panel",{
      id: 'centerRegionLayout_'+record.data.text,
      layout:'border',
      title: record.data.text + " Dynamic Data",
      closable:true,
      items:[
      {
        id: record.data.text,
        xtype:'dynamic_forms_DynamicDataGridPanel',
        model_name:record.data.text,
        dataUrl: '/erp_forms/erp_app/desktop/dynamic_forms/data/index/'+record.data.text,
        setupUrl: '/erp_forms/erp_app/desktop/dynamic_forms/data/setup/'+record.data.text,
        region:'center',
        height:300,
        collapsible:false,
        centerRegion:self
      }],
      tbar:{
        items:[
        {
          text: "New " + record.data.text + " Record",
          iconCls:'icon-add',
          handler:function(btn){
            self.setWindowStatus('Getting form...');
            Ext.Ajax.request({
              url: '/erp_forms/erp_app/desktop/dynamic_forms/forms/get',
              method: 'POST',
              params:{
                model_name:record.data.text,
                form_action: 'create'
              },
              success: function(response) {
                self.clearWindowStatus();
                form_definition = Ext.decode(response.responseText);
                if (form_definition.success === false){
                    Ext.Msg.alert('Error', form_definition.error);
                }else{
                  var newRecordPanel = Ext.create('Ext.panel.Panel',{
                      itemId: record.get("text")+'-new',
                      layout: 'border',
                      title: 'New '+record.get("text"),
                      closable: true,
                      autoScroll: true,
                      items: [form_definition],
                      listeners:{
                        'afterrender':function(panel){
                            panel.query('dynamic_form_panel').first().addListener('aftercreate', function(args){
                              // close and reopen tab
                              var tabPanel = panel.findParentByType('tabpanel');
                              tabPanel.remove(panel);
                              Ext.getCmp(record.data.text).editRecord(args.record);
                              // reload grid
                              tabPanel.query('#'+record.get("text")).first().query('shared_dynamiceditablegrid').first().getStore().load({});
                            });
                        }                        
                    }
                  });
                  self.centerRegion.workArea.add(newRecordPanel);
                  self.centerRegion.workArea.setActiveTab(self.centerRegion.workArea.items.length - 1);
                }
              },
              failure: function(response) {
                self.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error getting form');
              }
            });
          }
        },
        {
          text: "Edit Selected Record",
          iconCls:'icon-edit',
          handler:function(btn){
            var rec = Ext.getCmp(record.data.text).query('shared_dynamiceditablegrid').first().getSelectionModel().getSelection().first();
            if (rec) {
              Ext.getCmp(record.data.text).editRecord(rec);
            }else{
              Ext.Msg.alert('Error', 'No record selected.');
            }
          }
        },
        {
          text: "Delete Selected Record",
          iconCls:'icon-delete',
          handler:function(btn){
            var rec = Ext.getCmp(record.data.text).query('shared_dynamiceditablegrid').first().getSelectionModel().getSelection().first();
            if (rec){
              var messageBox = Ext.MessageBox.confirm('Confirm', 'Are you sure?', function(btn){
                if (btn == 'yes') Ext.getCmp(record.data.text).deleteRecord(rec, record.data.text);
              });              
            }else{
              Ext.Msg.alert('Error', 'No record selected.');
            }

          }
        },
        {xtype: 'tbspacer', width: 10},
        {
            fieldLabel: '<span data-qtitle="Search" data-qwidth="200" data-qtip="">Search</span>',
            labelWidth : 40,
            itemId: 'dynamicDataSearchValue',
            xtype: 'textfield',
            width: 180,
            value: ''
        },
        {xtype: 'tbspacer', width: 1},
        {
            xtype: 'button',
            iconCls: 'x-btn-icon icon-search',
            handler: function(button) {
              var tabPanel = button.findParentByType('tabpanel');
              var value = tabPanel.query('#dynamicDataSearchValue').first().getValue();
              tabPanel.query('#'+record.data.text).first().query('shared_dynamiceditablegrid').first().getStore().load({
                params: {query_filter: value}                
              });              
            }
        }
        ]
      }
    });

    this.centerRegion.workArea.add(centerRegionLayout);
    this.centerRegion.workArea.setActiveTab(this.centerRegion.workArea.items.length - 1);
  },
    
  initComponent: function() {
    this.callParent(arguments);
  },

  constructor : function(config) {
    var self = this;

    Ext.define('FormsTreeNode', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'string'},
            {name: 'text', type: 'string'},
            {name: 'iconCls', type: 'string'},
            {name: 'isFormModel', type: 'boolean'},
            {name: 'file_security_default', type: 'string'},
            {name: 'show_in_multitask', type: 'boolean'},
            {name: 'formModelName', type: 'string'},
            {name: 'isDefaultForm', type: 'boolean'},
            {name: 'isForm', type: 'boolean'},
            {name: 'formModelId', type: 'int'},
            {name: 'formId', type: 'int'},
            {name: 'leaf', type: 'boolean'}
        ]
    });
    
    var store = Ext.create('Ext.data.TreeStore', {
      storeId: 'formsTreeStore',
      model: 'FormsTreeNode',
      folderSort: true,
      autoLoad: false,
      sorters: [{
        property:'text',
        direction: 'ASC'
      }],
      proxy:{
        type: 'ajax',
        url: '/erp_forms/erp_app/desktop/dynamic_forms/forms/get_tree'
      },      
      root: {
        text: 'Dynamic Forms',
        expanded: true
      }
    });

    this.formsTree = Ext.create("Ext.tree.Panel",{
      title: 'Models & Forms',
      store:store,
      rootVisible:false,
      autoScroll: true,
      tbar:{
        items:[
        {
          text:'New Form Model',
          iconCls:'icon-add',
          handler:function(btn){
            var newModelWindow = Ext.create("Ext.window.Window",{
              layout:'fit',
              width:375,
              title:'New Dynamic Form Model',
              //height:100,
              plain: true,
              buttonAlign:'center',
              items: Ext.create("Ext.form.Panel",{
                labelWidth: 110,
                frame:false,
                bodyStyle:'padding:5px 5px 0',
                url:'/erp_forms/erp_app/desktop/dynamic_forms/models/create',
                defaults: {
                  width: 225
                },
                items: [{
                  xtype:'textfield',
                  fieldLabel:'Model Name',
                  allowBlank:false,
                  name:'model_name',
                  plugins: [new helpQtip('This should be a camel case class name.<br /> Example: WebsiteInquiry')],
                  vtype: 'alphanum',
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
                },
                {
                  xtype:'combobox',
                  fieldLabel:'File Security Default',
                  allowBlank:false,
                  name:'file_security_default',
                  value: 'private',
                  store:[
                    ['private','Private'],
                    ['public','Public']
                  ]
                }]
              }),
              buttons: [{
                text:'Submit',
                listeners:{
                  'click':function(button){
                    var formPanel = button.findParentByType('window').query('form').first();
                    self.setWindowStatus('Adding new dynamic form model ...');
                    if (formPanel.getForm().isValid()){
                      formPanel.getForm().submit({
                        success:function(form, action){
                          self.clearWindowStatus();
                          var obj =  Ext.decode(action.response.responseText);
                          if(obj.success){
                            self.formsTree.getStore().load({
                              node: self.formsTree.getRootNode()
                            });
                            newModelWindow.close();
                          }else{
                            Ext.Msg.alert("Error", obj.message);
                          }
                        },
                        failure:function(form, action){
                          self.clearWindowStatus();
                          var obj =  Ext.decode(action.response.responseText);
                          if(obj !== null){
                            Ext.Msg.alert("Error", obj.message);
                          }else{
                            Ext.Msg.alert("Error", "Error adding form model");
                          }
                        }
                      });
                    }
                  }
                }
              },{
                text: 'Close',
                handler: function(){
                  newModelWindow.close();
                }
              }]
            });
            newModelWindow.show();
          }
        }
        ]
      },
      listeners:{
        'itemclick':function(view, record, item, index, e){
          e.stopEvent();
          if(record.data['isFormModel']){
            if (record.data['children'].length > 0){
              self.getDynamicData(record);
            }
          }
          else if(record.data['isForm']){
            self.getDynamicForm(record);
          }
        },
        'itemcontextmenu':function(view, record, htmlItem, index, e){
          e.stopEvent();
          var items = [];

          if(record.data['isFormModel']){
                      
            // can only display data if there is a form to provide a definition
            if (record.data['children'].length > 0){
              items.push({
                text:'View Dynamic Data',
                iconCls:'icon-document',
                listeners:{
                  'click':function(){
                    self.getDynamicData(record);
                  }
                }
              });
            }

            items.push({
              text:'New Dynamic Form',
              iconCls:'icon-add',
              listeners:{
                'click':function(){
                  self.addDynamicForm(record);
                }
              }
            });

            items.push({
              text:'Configure',
              iconCls:'icon-add',
              listeners:{
                'click':function(){
                  self.configureFormModel(record);
                }
              }
            });
                        
            if(record.data['text'] != 'DynamicFormDocument'){
              items.push({
                text:'Delete Form Model',
                iconCls:'icon-delete',
                listeners:{
                  'click':function(){
                    self.deleteModel(record);
                  }
                }
              });
            }
          }
          else if(record.data['isForm']){

            items.push({
              text:'Edit Dynamic Form',
              iconCls:'icon-edit',
              listeners:{
                'click':function(){
                  self.getDynamicForm(record);
                }
              }
            });
            if(!record.data['isDefaultForm']){
              items.push({
                text:'Set As Default Form',
                iconCls:'icon-edit',
                listeners:{
                  'click':function(){
                    self.setDefaultForm(record);
                  }
                }
              });
            }

            items.push({
              text:'Delete Dynamic Form',
              iconCls:'icon-delete',
              listeners:{
                'click':function(){
                  self.deleteForm(record);
                }
              }
            });
          }
                    
          var contextMenu = Ext.create("Ext.menu.Menu",{
            items:items
          });
          contextMenu.showAt(e.xy);
        }
      }
    });

    this.fieldTypes = {
        xtype: 'treepanel',
        viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop',
                ddGroup: 'fieldsDDGroup',
                enableDrop: false
            }
        },                            
        itemId: 'field_types',
        title: 'Field Types',
        root: fieldTreeRootNode,
        rootVisible: true,
        autoScroll: true,
        listeners:{
          beforerender:function(){
            // we have to set this qtip this way so that we have access to ErpTechSvcs.Config
            var filefield = fieldTreeRootNode.findChild('field_xtype','filefield');
            var valid_types = ErpTechSvcs.Config.file_upload_types.replace(/,/g,', ');
            filefield.data.qtip = 'Model must be enabled with has_file_assets. Use limited to one upload field per form. Compass AE is currently configured with a max file upload size of '+ErpTechSvcs.Config.max_file_size_in_mb+'MB and limited to file types '+valid_types+". Be sure to configure your web and/or mail servers accordingly.";
          }
        }
    };

    config = Ext.apply({
      id: 'dynamic_forms_westregion',
      region:'west',
      split:true,
      width:200,
      header: false,
      hideCollapseTool: true,
      collapsible: true,
      collapseMode: 'mini',
      items: [this.formsTree, this.fieldTypes],
      activeTab: 0
    }, config);

    this.callParent([config]);
  }
});
