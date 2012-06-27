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

Ext.define('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogEntry', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'party_description',
            type:'string'
        },
        {
            name:'description',
            type:'string'
        },
        {
            name:'created_at',
            type:'date'
        },
        {
            name:'audit_log_type',
            type:'string'
        }

    ]
});

Ext.create('Ext.data.Store', {
    storeId:'audit-log-view-audit-log-entry-store',
    model:'Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogEntry',
    pageSize:15,
    start:0,
    remoteSort:true,
    proxy:{
        type:'ajax',
        url:'/erp_app/desktop/audit_log_viewer/index.json',
        extraParams:{
            start_date:null,
            end_date:null,
            audit_log_type_id:null
        },
        reader:{
            type:'json',
            root:'audit_log_entries',
            totalProperty:'total_count'

        }
    }
});

Ext.define('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogGrid', {
    alias:'widget.audit_log_viewer-audit_log_grid',
    extend:'Ext.grid.Panel',
    title:'Audit Log Records',
    store:Ext.getStore('audit-log-view-audit-log-entry-store'),
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

                        var store = btn.up('toolbar').up('audit_log_viewer-audit_log_grid').getStore();
                        store.currentPage = 1;
                        store.load({params:{start:0, start_date:startDate, end_date:endDate, audit_log_type_id:auditLogTypeId}});
                    }
                },
                {
                    xtype:'button',
                    text:'All',
                    iconCls:'icon-eye',
                    handler:function (btn) {
                        var store = btn.up('toolbar').up('audit_log_viewer-audit_log_grid').getStore();
                        store.currentPage = 1;
                        store.load({params:{start:0, start_date:null, end_date:null, audit_log_type_id:null}});
                    }
                }
            ]
        }
    ],
    columns:[
        {
            header:'Log Id',
            dataIndex:'id',
            width:50
        },
        {
            header:'Logged By',
            dataIndex:'party_description',
            sortable:false,
            width:200
        },
        {
            header:'Description',
            dataIndex:'description',
            sortable:false,
            width:300
        },
        {
            header:'Created At',
            dataIndex:'created_at',
            renderer:function(value){return Ext.Date.format(value, 'm-d-Y');},
            width:100
        },
        {
            header:'Audit Log Type',
            dataIndex:'audit_log_type',
            width:200
        }

    ],
    viewConfig:{
        stripeRows:true
    },
    listeners:{
        'itemdblclick':function(view, record, item, index, e, eOpts){
            view.up('audit_log_viewer-tabpanel').fireEvent('auditLogEntrySelected', record);
        }
    }
});
