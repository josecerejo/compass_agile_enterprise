Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsPanel",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_groupspanel',

  initComponent: function() {
    Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsPanel.superclass.initComponent.call(this, arguments);
  },

  setGroup : function(record){
    var assign_to_id = record.get('id');
    var assign_to_description = record.get('description');

    var security_management_groupspanel = this;

    var security_management_userswidget = security_management_groupspanel.down('security_management_userswidget');
    security_management_userswidget.assign_to_id = assign_to_id;
    security_management_userswidget.assign_to_description = assign_to_description;

    var security_management_roleswidget = security_management_groupspanel.down('security_management_roleswidget');
    security_management_roleswidget.assign_to_id = assign_to_id;
    security_management_roleswidget.assign_to_description = assign_to_description;

    var security_management_capabilitieswidget = security_management_groupspanel.down('security_management_capabilitieswidget');
    security_management_capabilitieswidget.assign_to_id = assign_to_id;
    security_management_capabilitieswidget.assign_to_description = assign_to_description;

    var security_management_groupseffectivesecurity = security_management_groupspanel.down('security_management_groupseffectivesecurity');
    security_management_groupseffectivesecurity.assign_to_id = assign_to_id;
    security_management_groupseffectivesecurity.assign_to_description = assign_to_description;    
  },

  constructor : function(config) {
    var self = this;

    config = Ext.apply({
      width:460,
      title:'Groups',
      autoScroll: true,
      tbar:[{
          text:'New Group',
          iconCls:'icon-add',
          handler:function(btn){
            var newWindow = Ext.create("Ext.window.Window",{
              layout:'fit',
              width:375,
              title:'New Group',
              height:100,
              plain: true,
              buttonAlign:'center',
              items: Ext.create('Ext.form.Panel',{
                labelWidth: 110,
                frame:false,
                bodyStyle:'padding:5px 5px 0',
                url:'/erp_app/desktop/security_management/groups/create',
                defaults: {
                  width: 225
                },
                items: [
                {
                  xtype:'textfield',
                  fieldLabel:'Group Name',
                  allowBlank:false,
                  name:'description',
                  listeners:{
                    afterrender:function(field){
                        field.focus(false, 200);
                    },
                    specialkey: function(field, e){
                      if (e.getKey() == e.ENTER) {
                        var button = field.findParentByType('window').down('#submitButton');
                        button.fireEvent('click', button);
                      }
                    } 
                  }
                }
                ]
              }),
              buttons: [{
                text:'Submit',
                itemId: 'submitButton',
                listeners:{
                  'click':function(button){
                    var formPanel = button.findParentByType('window').down('form');
                    formPanel.getForm().submit({
                      success:function(form, action){
                        var obj =  Ext.decode(action.response.responseText);
                        if(obj.success){
                          var all_groups = self.down('#all_groups').down('shared_dynamiceditablegrid');
                          all_groups.getStore().load();
                          newWindow.close();
                        }
                        else{
                          Ext.Msg.alert("Error", obj.message);
                        }
                      },
                      failure:function(form, action){
                        var obj =  Ext.decode(action.response.responseText);
                        if(obj !== null){
                          Ext.Msg.alert("Error", obj.message);
                        }
                        else{
                          Ext.Msg.alert("Error", "Error importing website");
                        }
                      }
                    });
                  }
                }
              },{
                text: 'Close',
                handler: function(){
                  newWindow.close();
                }
              }]
            });
            newWindow.show();
          }
        }        
        ],
        items:[{
          xtype: 'security_management_group_grid',
          itemId: 'all_groups',
          //title: 'All Groups',
          width: 400,
          setupUrl: '/erp_app/desktop/security_management/groups/available_setup',
          dataUrl: '/erp_app/desktop/security_management/groups/available',
          multiSelect: false,
          grid_listeners:{
            afterrender:function(grid){
              // autoLoad was causing erroneous calls to /erp_app/desktop/true so we manually load here
              grid.getStore().load();
            },
            itemclick: function(grid, record, index, eOpts){
                self.setGroup(record);

                // get active tabpanel
                var activeTabPanel = grid.findParentByType('security_management_groupspanel').down('tabpanel').getActiveTab();
                activeTabPanel.refreshWidget();
                activeTabPanel.updateTitle();
            }
          }        
        },
        {
            xtype: 'tabpanel',
            items:[
                {
                    xtype:'security_management_userswidget',
                    assign_to: 'Group'
                },
                {
                    xtype:'security_management_roleswidget',
                    assign_to: 'Group'
                },
                {
                    xtype:'security_management_capabilitieswidget',
                    assign_to: 'Group'
                },
                {
                    xtype:'security_management_groupseffectivesecurity'
                }

            ]
        }]        

    }, config);

    Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsPanel.superclass.constructor.call(this, config);
  }

});