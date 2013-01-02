Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupsWidget",{
  extend:"Ext.panel.Panel",
  alias:'widget.security_management_groupswidget',

  updateTitle : function(){
    if (this.assign_to_description){
      this.down('#assignment').setTitle('Assign Groups to '+this.assign_to+' '+this.assign_to_description);
    }
  },

  refreshWidget : function(tab){
    if (tab === undefined) tab = this;

    if (tab.assign_to_id){
      //need a delay to allow for rendering of shared_dynamiceditablegrid
      setTimeout( function() { 
        var extraParams = {
          assign_to: tab.assign_to,
          id: tab.assign_to_id
        };

        var available_grid = tab.down('#available').down('shared_dynamiceditablegrid');
        available_grid.getStore().getProxy().extraParams = extraParams;
        available_grid.getStore().load();

        var selected_grid = tab.down('#selected').down('shared_dynamiceditablegrid');
        selected_grid.getStore().getProxy().extraParams = extraParams;
        selected_grid.getStore().load();
      }, 500 );
    }
  },

  constructor : function(config) {
    var self = this;

    var available_grid = {
      xtype: 'security_management_group_grid',
      itemId: 'available',
      title: 'Available Groups',
      width: 400,
      height: 340,
      region: 'west',
      setupUrl: '/erp_app/desktop/security_management/groups/available_setup',
      dataUrl: '/erp_app/desktop/security_management/groups/available',
      autoLoad: false
    };

    var selected_grid = {
      xtype: 'security_management_group_grid',
      itemId: 'selected',
      title: 'Selected Groups',
      width: 400,
      height: 340,
      region: 'east',
      setupUrl: '/erp_app/desktop/security_management/groups/selected_setup',   
      dataUrl: '/erp_app/desktop/security_management/groups/selected',
      autoLoad: false
    };

    var assignment = {
        xtype: 'panel',
        itemId: 'assignment',
        title: 'Manage Groups',
        layout: 'table',
        autoScroll: true,
        height: 600,
        bodyPadding: 10,
        items:[
          available_grid,
          {
            xtype: 'container',
            width: 22,
            bodyPadding: 5,
            items:[
              {xtype: 'SecurityManagement-AddGroupButton'},
              {xtype: 'SecurityManagement-RemoveGroupButton'}
            ]
          },
          selected_grid
        ]
    };

    config = Ext.apply({
      title:'Groups',
      assign_to: (config.assign_to || 'User'),
      items:[
        assignment
      ],
      listeners:{
        activate: function(tab){
          self.refreshWidget(tab);
          self.updateTitle();
        }
      }

    }, config);

    this.callParent([config]);
  }
});

Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement.GroupGrid",{
    extend:"Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel",
    alias:'widget.security_management_group_grid',
    
    constructor : function(config) {
        config = Ext.apply({
            id:config.id,
            title: config.title,
            editable:false,
            page:true,
            pageSize: 10,
            multiSelect: (config.multiSelect === false ? false : true),
            displayMsg:'Displaying {0} - {1} of {2}',
            emptyMsg:'Empty',
            tbar:[{
                  fieldLabel: '<span data-qtitle="Search" data-qwidth="200" data-qtip="">Search</span>',
                  labelWidth : 40,
                  itemId: 'searchValue',
                  xtype: 'textfield',
                  width: 180,
                  value: '',
                  listeners:{
                    specialkey: function(field, e){
                      if (e.getKey() == e.ENTER) {
                        var grid = field.findParentByType('security_management_group_grid');
                        var button = grid.query('#searchButton').first();
                        button.fireEvent('click', button);
                      }
                    }              
                  }
              },
              {xtype: 'tbspacer', width: 1},
              {
                  xtype: 'button',
                  itemId: 'searchButton',
                  iconCls: 'x-btn-icon icon-search',
                  listeners:{
                    click: function(button) {
                      if (button.findParentByType('security_management_groupswidget') && !button.findParentByType('security_management_groupswidget').assign_to_id) return;
                      var grid = button.findParentByType('security_management_group_grid');
                      var value = grid.query('#searchValue').first().getValue();
                      grid.query('shared_dynamiceditablegrid').first().getStore().load({
                        params: {query_filter: value}                
                      });                        
                    }              
                  }
              }
              ]
        }, config);

        this.callParent([config]);
    }
});

Ext.define('Compass.ErpApp.Desktop.Applications.SecurityManagement.AddGroupButton',{
    extend: 'Ext.button.Button',
    alias: 'widget.SecurityManagement-AddGroupButton',
    itemId: 'AddGroupButton',
    cls: 'x-btn-text-icon',
    iconCls : 'icon-arrow-right-blue',
    formBind: false,
    tooltip: 'Add to Selected',
    listeners: {
        click: function(button) {
          var security_management_groupswidget = button.findParentByType('security_management_groupswidget');
          var available_grid = security_management_groupswidget.query('#available').first().down('shared_dynamiceditablegrid');
          var selected_grid = security_management_groupswidget.query('#selected').first().down('shared_dynamiceditablegrid');
          var selection = available_grid.getSelectionModel().getSelection();
          if (selection.length > 0){
            var selected_groups = [];
            Ext.each(selection, function(s){
              selected_groups.push(s.data.id);
            });

            Ext.Ajax.request({
              url: '/erp_app/desktop/security_management/groups/add',
              method: 'POST',
              params:{
                assign_to: security_management_groupswidget.assign_to,
                id: security_management_groupswidget.assign_to_id,
                selection: Ext.encode(selected_groups)
              },
              success: function(response) {
                var json_response = Ext.decode(response.responseText);
                if (json_response.success){
                  available_grid.getStore().load();
                  selected_grid.getStore().load();                  
                }else{
                  Ext.Msg.alert('Error', Ext.decode(response.responseText).message);
                }
              },
              failure: function(response) {
                Ext.Msg.alert('Error', 'Error Adding Group');
              }
            });
          }else{
            Ext.Msg.alert('Error', 'Please make a selection.');
          }
        }
    }
  });

  Ext.define('Compass.ErpApp.Desktop.Applications.SecurityManagement.RemoveGroupButton',{
    extend: 'Ext.button.Button',
    alias: 'widget.SecurityManagement-RemoveGroupButton',
    itemId: 'RemoveGroupButton',
    cls: 'x-btn-text-icon',
    iconCls : 'icon-arrow-left-blue',
    formBind: false,
    tooltip: 'Remove from Selected',
    listeners: {
        click: function(button) {
          var security_management_groupswidget = button.findParentByType('security_management_groupswidget');
          var available_grid = security_management_groupswidget.query('#available').first().down('shared_dynamiceditablegrid');
          var selected_grid = security_management_groupswidget.query('#selected').first().down('shared_dynamiceditablegrid');
          var selection = selected_grid.getSelectionModel().getSelection();
          if (selection.length > 0){
            var selected_groups = [];
            Ext.each(selection, function(s){
              selected_groups.push(s.data.id);
            });

            Ext.Ajax.request({
              url: '/erp_app/desktop/security_management/groups/remove',
              method: 'POST',
              params:{
                assign_to: security_management_groupswidget.assign_to,
                id: security_management_groupswidget.assign_to_id,
                selection: Ext.encode(selected_groups)
              },
              success: function(response) {
                var json_response = Ext.decode(response.responseText);
                if (json_response.success){
                  available_grid.getStore().load();
                  selected_grid.getStore().load();                  
                }else{
                  Ext.Msg.alert('Error', Ext.decode(response.responseText).message);
                }
              },
              failure: function(response) {
                Ext.Msg.alert('Error', 'Error Removing Group');
              }
            });
          }else{
            Ext.Msg.alert('Error', 'Please make a selection.');
          }
        }
    }
  });
