Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.CapabilitiesPanel",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_capabilitiespanel',

  initComponent: function() {
    Compass.ErpApp.Desktop.Applications.SecurityManagement.CapabilitiesPanel.superclass.initComponent.call(this, arguments);
  },

  setCapability : function(record){
    var assign_to_id = record.get('id');
    var assign_to_description = record.get('description');

    var security_management_capabilitiespanel = this;

    var security_management_userswidget = security_management_capabilitiespanel.down('security_management_userswidget');
    security_management_userswidget.assign_to_id = assign_to_id;
    security_management_userswidget.assign_to_description = assign_to_description;

    var security_management_groupswidget = security_management_capabilitiespanel.down('security_management_groupswidget');
    security_management_groupswidget.assign_to_id = assign_to_id;
    security_management_groupswidget.assign_to_description = assign_to_description;

    var security_management_roleswidget = security_management_capabilitiespanel.down('security_management_roleswidget');
    security_management_roleswidget.assign_to_id = assign_to_id;
    security_management_roleswidget.assign_to_description = assign_to_description;
  },

  constructor : function(config) {
    var self = this;

    config = Ext.apply({
      width:460,
      title:'Capabilities',
      autoScroll: true,
      tbar:[     
        ],
        items:[{
          xtype: 'security_management_capability_grid',
          itemId: 'all_capabilities',
          width: 400,
          setupUrl: '/erp_app/desktop/security_management/capabilities/available_setup',
          dataUrl: '/erp_app/desktop/security_management/capabilities/available',
          multiSelect: false,
          grid_listeners:{
            afterrender:function(grid){
              // autoLoad was causing erroneous calls to /erp_app/desktop/true so we manually load here
              grid.getStore().load();
            },
            itemclick: function(grid, record, index, eOpts){
                self.setCapability(record);

                // get active tabpanel
                var activeTabPanel = grid.findParentByType('security_management_capabilitiespanel').down('tabpanel').getActiveTab();
                activeTabPanel.reloadGrids();
                activeTabPanel.updateAssignmentTitle();
            }
          }        
        },
        {
            xtype: 'tabpanel',
            items:[
                {
                    xtype:'security_management_userswidget',
                    assign_to: 'Capability'
                },
                {
                    xtype:'security_management_groupswidget',
                    assign_to: 'Capability'
                },
                {
                    xtype:'security_management_roleswidget',
                    assign_to: 'Capability'
                }
            ]
        }]        

    }, config);

    Compass.ErpApp.Desktop.Applications.SecurityManagement.CapabilitiesPanel.superclass.constructor.call(this, config);
  }

});