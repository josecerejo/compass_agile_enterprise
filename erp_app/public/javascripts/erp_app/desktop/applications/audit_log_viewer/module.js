Ext.define("Compass.ErpApp.Desktop.Applications.AuditLogViewer", {
    extend:"Ext.ux.desktop.Module",
    id:'audit_log_viewer-win',
    init:function () {
        this.launcher = {
            text:'audit_log_viewer',
            iconCls:'icon-history',
            handler:this.createWindow,
            scope:this
        }
    },

    createWindow:function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('audit_log_viewer');
        if (!win) {

            var container = Ext.create('Compass.ErpApp.Desktop.Applications.AuditLogViewer.TabPanel');

            win = desktop.createWindow({
                id:'audit_log_viewer',
                title:'Audit Log Viewer',
				layout:'fit',
				autoScroll:true,
                width:1000,
                height:540,
                iconCls:'icon-history',
                shim:false,
				autoScroll:true,
                animCollapse:false,
                constrainHeader:true,
                items:[container]
            });

            //had to add the docked item after it was created.  Was throwing style error????
            container.down('audit_log_viewer-audit_log_grid').addDocked({
                xtype:'pagingtoolbar',
                store:Ext.getStore('audit-log-view-audit-log-entry-store'),
                dock:'bottom',
                displayInfo:true
            });

            //load the grid store
            container.down('audit_log_viewer-audit_log_grid').getStore().load({params:{start:0}});
        }
        win.show();
    }
});
