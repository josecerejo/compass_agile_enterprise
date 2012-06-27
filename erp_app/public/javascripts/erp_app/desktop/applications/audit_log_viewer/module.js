Ext.define("Compass.ErpApp.Desktop.Applications.AuditLogViewer.TabPanel", {
    alias:'widget.audit_log_viewer-tabpanel',
    extend:"Ext.tab.Panel",
    plugins:Ext.create('Ext.ux.TabCloseMenu', {
        extraItemsTail:[
            '-',
            {
                text:'Closable',
                checked:true,
                hideOnClick:true,
                handler:function (item) {
                    currentItem.tab.setClosable(item.checked);
                }
            }
        ],
        listeners:{
            aftermenu:function () {
                currentItem = null;
            },
            beforemenu:function (menu, item) {
                var menuitem = menu.child('*[text="Closable"]');
                currentItem = item;
                menuitem.setChecked(item.closable);
            }
        }
    }),
    constructor:function (config) {
        this.addEvents({
            'auditLogEntrySelected':true
        });

        this.callParent([config]);
    }
});

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

            var container = Ext.create('Compass.ErpApp.Desktop.Applications.AuditLogViewer.TabPanel', {
                items:[
                    {xtype:'audit_log_viewer-audit_log_grid'}
                ],
                listeners:{
                    auditLogEntrySelected:function (auditLogEntry) {
                        var audit_log_item_grid = Ext.create('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogItemGrid',
                            {
                                closable:true,
                                listeners:{
                                    'render':function(comp){
                                        comp.getStore().load({params:{audit_log_id:auditLogEntry.get('id')}});
                                    }
                                }
                            }
                        );
                        this.add(audit_log_item_grid);
                        this.setActiveTab(audit_log_item_grid);
                    }
                }
            });

            win = desktop.createWindow({
                id:'audit_log_viewer',
                title:'Audit Log Viewer',
                width:1000,
                height:540,
                iconCls:'icon-history',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout:'fit',
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
