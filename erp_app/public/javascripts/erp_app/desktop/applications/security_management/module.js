Compass.ErpApp.Utility.JsLoader.load(['/javascripts/erp_app/shared/dynamic_forms/dynamic_form_fields.js'], function(){

Ext.define("Compass.ErpApp.Desktop.Applications.SecurityManagement",{
    extend:"Ext.ux.desktop.Module",
    id:'security_management-win',
    init : function(){
        this.launcher = {
            text: 'Security Management',
            iconCls:'icon-key',
            handler: this.createWindow,
            scope: this
        };
    },

    createWindow : function(){
       var desktop = this.app.getDesktop();
        var win = desktop.getWindow('security_management');
        if(!win){
            var tabPanel = Ext.create('Ext.tab.Panel',{
                region:'center',
                items:[{
                    xtype: 'security_management_userspanel'
                },
                {
                    xtype: 'security_management_groupspanel'
                },
                {
                    xtype: 'security_management_rolespanel'
                },
                {
                    xtype: 'security_management_capabilitiespanel'
                }
                ]
            });
            win = desktop.createWindow({
                id: 'security_management',
                title:'Security Management',
                maximized: true,
                width:1000,
                height:550,
                iconCls: 'icon-key',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                items:[tabPanel]
            });
        }
        win.show();
    }
});

  Ext.define('Compass.ErpApp.Desktop.Applications.SecurityManagement.SearchBox',{
    extend: 'Compass.ErpForms.DynamicForms.DynamicRelatedSearchBox',
    alias: 'widget.SecurityManagement-searchbox',

    constructor : function(config) {
        var self = this;
        config = Ext.apply({
            url:'/erp_app/desktop/security_management/search',
            display_template: config.display_template,
            fields: config.fields,
            extraParams: {
                model: (config.model || 'User') 
            }

        }, config);
    }

  });
});