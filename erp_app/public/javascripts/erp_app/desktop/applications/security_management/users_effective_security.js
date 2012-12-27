Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersEffectiveSecurity",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_userseffectivesecurity',

  initComponent: function() {
    Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersEffectiveSecurity.superclass.initComponent.call(this, arguments);
  },

  updateTitle : function(){
    if (this.assign_to_description){
      this.down('#effective').setTitle('Effective Security for User '+this.assign_to_description);
    }
  },

  refreshWidget : function(tab){
    if (tab === undefined) tab = this;

    if (tab.assign_to_id){

      Ext.Ajax.request({
        url: '/erp_app/desktop/security_management/users/effective_security',
        method: 'POST',
        params:{
          id: tab.assign_to_id
        },
        success: function(response) {
          var json_response = Ext.decode(response.responseText);
          if (json_response.success){
            if (json_response.capabilities.length > 0){
              tab.down('#roles').update(json_response.roles);
            }else{
              tab.down('#roles').update("No roles.");
            }
            if (json_response.capabilities.length > 0){
              tab.down('#capabilities').update(json_response.capabilities);
            }else{
              tab.down('#capabilities').update("No capabilities.");
            }
          }else{
            Ext.Msg.alert('Error', Ext.decode(response.responseText).message);
          }
        },
        failure: function(response) {
          Ext.Msg.alert('Error', 'Error Retrieving Effective Security');
        }
      });

    }
  },

  constructor : function(config) {
    var self = this;

    var roles_tpl = new Ext.XTemplate(
          '<tpl for=".">',
          '{description}<br />',
          '</tpl>'
          );

    var roles = {
        xtype: 'panel',
        itemId: 'roles',
        title: 'Roles',
        layout: 'hbox',
        autoScroll: true,
        bodyPadding: 10,
        tpl: roles_tpl,
        listeners:{
            'afterrender':function(comp){
                comp.update('Select a User');
            }
        }
    };

    var capabilities_tpl = new Ext.XTemplate(
          '<tpl for=".">',
          '{capability_type_iid} {capability_resource_type}<br />',
          '</tpl>'
          );

    var capabilities = {
        xtype: 'panel',
        itemId: 'capabilities',
        title: 'Capabilities',
        layout: 'hbox',
        autoScroll: true,
        bodyPadding: 10,
        tpl: capabilities_tpl,
        listeners:{
            'afterrender':function(comp){
                comp.update('Select a User');
            }
        }
    };

    var effective = {
        xtype: 'panel',
        itemId: 'effective',
        title: 'Effective Security',
        layout: 'hbox',
        autoScroll: true,
        bodyPadding: 10,
        items:[
          roles,
          capabilities
        ]
    };

    config = Ext.apply({
      title:'Effective Security',
      items:[
        effective
      ],
      listeners:{
        activate: function(tab){
          self.refreshWidget(tab);
          self.updateTitle();
        }
      }

    }, config);

    Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersEffectiveSecurity.superclass.constructor.call(this, config);
  }
});