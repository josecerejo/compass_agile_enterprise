Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsEffectiveSecurity",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_groupseffectivesecurity',

  initComponent: function() {
    Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsEffectiveSecurity.superclass.initComponent.call(this, arguments);
  },

  updateTitle : function(){
    if (this.assign_to_description){
      this.down('#effective').setTitle('Effective Security for Group '+this.assign_to_description);
    }
  },

  refreshWidget : function(tab){
    if (tab === undefined) tab = this;

    if (tab.assign_to_id){

      Ext.Ajax.request({
        url: '/erp_app/desktop/security_management/groups/effective_security',
        method: 'POST',
        params:{
          id: tab.assign_to_id
        },
        success: function(response) {
          var json_response = Ext.decode(response.responseText);
          if (json_response.success){
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
                comp.update('Select a Group');
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

    Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsEffectiveSecurity.superclass.constructor.call(this, config);
  }
});