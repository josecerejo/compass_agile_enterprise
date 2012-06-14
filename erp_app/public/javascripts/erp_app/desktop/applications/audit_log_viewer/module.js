Ext.define('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogType', {
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int'},
        {name:'description', type:'string'},
        {name:'internal_identifier', type:'string'}
    ]
});

Ext.create('Ext.data.Store', {
    storeId:'audit-log-view-audit-log-type-store',
    model:'Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogType',
    proxy:{
        type:'ajax',
        url:'/erp_app/desktop/audit_log_viewer/audit_log_types.json',
        reader:{
            type:'json',
            root:'audit_log_types'
        }
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

            var container = Ext.create('Ext.panel.Panel', {
                layout:'fit',
                dockedItems:[
                    {
                        xtype:'toolbar',
                        dock:'top',
                        items:[
                            'Start Date:',
                            {
                                xtype:'datefield',
                                itemId:'startDate',
                                value:new Date()

                            },
                            'End Date:',
                            {
                                xtype:'datefield',
                                itemId:'endDate',
                                value:new Date()
                            },
                            'Audit Log Type',
                            {
                                xtype:'combo',
                                itemId:'auditLogTypeId',
                                store:Ext.getStore('audit-log-view-audit-log-type-store'),
                                queryMode:'remote',
                                displayField:'description',
                                valueField:'id'
                            },
                            {
                                xtype:'button',
                                text:'Search',
                                iconCls:'icon-search',
                                handler:function (btn) {
                                    var startDate = btn.up('toolbar').down('#startDate').getValue();
                                    var endDate = btn.up('toolbar').down('#endDate').getValue();
                                    var auditLogTypeId = btn.up('toolbar').down('#auditLogTypeId').getValue();

                                    var store = btn.up('toolbar').up('panel').down('audit_log_viewer-audit_log_grid').getStore();
                                    store.currentPage = 1;
                                    store.load({params:{start:0, start_date:startDate, end_date:endDate, audit_log_type_id:auditLogTypeId}});
                                }
                            },
                            {
                                xtype:'button',
                                text:'All',
                                iconCls:'icon-eye',
                                handler:function (btn) {
                                    var store = btn.up('toolbar').up('panel').down('audit_log_viewer-audit_log_grid').getStore();
                                    store.currentPage = 1;
                                    store.load({params:{start:0, start_date:null, end_date:null, audit_log_type_id:null}});
                                }
                            }
                        ]
                    }
                ],
                items:[
                    {xtype:'audit_log_viewer-audit_log_grid'}
                ]
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

            //had to add the docked this docked item after it was created.  Was throwing style error????
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
