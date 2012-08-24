Ext.define("Compass.ErpApp.Desktop.Applications.AuditLogViewer.TabPanel", {
    alias:'widget.audit_log_viewer-tabpanel',
    extend:"Ext.tab.Panel",
    autoScroll:true,
    items:[{xtype:'audit_log_viewer-audit_log_grid'}],
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
    listeners:{
        auditLogEntrySelected:function (auditLogEntry) {
            var audit_log_item_grid = Ext.create('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogItemGrid',
                {
                    closable:true,
                    listeners:{
                        'afterrender':function(comp){
                            comp.getStore().load({params:{audit_log_id:auditLogEntry.get('id')}});
                        }
                    }
                }
            );
            this.add(audit_log_item_grid);
            this.setActiveTab(audit_log_item_grid);
        }
    },
    constructor:function (config) {
        this.addEvents({
            'auditLogEntrySelected':true
        });

        this.callParent([config]);
    }
});