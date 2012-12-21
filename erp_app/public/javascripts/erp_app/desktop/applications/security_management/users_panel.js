Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersPanel",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_userspanel',

  initComponent: function() {
    Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersPanel.superclass.initComponent.call(this, arguments);
  },

  setUser : function(field){
    var assign_to_id = field.getValue();
    var assign_to_username = field.getStore().getById(assign_to_id).data.username;

    var security_management_userspanel = field.findParentByType('security_management_userspanel');

    var security_management_groupswidget = security_management_userspanel.down('security_management_groupswidget');
    security_management_groupswidget.assign_to_id = assign_to_id;
    security_management_groupswidget.assign_to_description = assign_to_username;

    var security_management_roleswidget = security_management_userspanel.down('security_management_roleswidget');
    security_management_roleswidget.assign_to_id = assign_to_id;
    security_management_roleswidget.assign_to_description = assign_to_username;

    var security_management_capabilitieswidget = security_management_userspanel.down('security_management_capabilitieswidget');
    security_management_capabilitieswidget.assign_to_id = assign_to_id;
    security_management_capabilitieswidget.assign_to_description = assign_to_username;
  },

  constructor : function(config) {
    var self = this;

    config = Ext.apply({
      width:460,
      title:'Users',
      autoScroll: true,
      items:[{
        xtype: 'form',
        bodyPadding: 10,
        items: [{
                xtype:'related_searchbox',
                fieldLabel: 'User',
                width: 300,
                url:'/erp_app/desktop/security_management/search',
                extraParams: {
                    model: 'User',
                    search_fields: "username",
                    display_fields: "username"
                },
                fields: [{name: "id"}, {name:"username"}],
                display_template: "{username}",
                listeners:{
                    select: function(field, records, eOpts){
                        self.setUser(field);

                        // get active tabpanel
                        var activeTabPanel = field.findParentByType('security_management_userspanel').down('tabpanel').getActiveTab();
                        activeTabPanel.reloadGrids();
                        activeTabPanel.updateAssignmentTitle();
                    }
                }
            }
        ]
        },
        {
            xtype: 'tabpanel',
            items:[
                {
                    xtype:'security_management_groupswidget',
                    assign_to: 'User'
                },
                {
                    xtype:'security_management_roleswidget',
                    assign_to: 'User'
                },
                {
                    xtype:'security_management_capabilitieswidget',
                    assign_to: 'User'
                }
            ]
        }
      ]

    }, config);

    Compass.ErpApp.Desktop.Applications.SecurityManagement.UsersPanel.superclass.constructor.call(this, config);
  }

});