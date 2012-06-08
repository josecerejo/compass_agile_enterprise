function short_date_renderer(value) {
    return Ext.Date.format(value, 'm-d-Y');
}

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
            renderer:short_date_renderer,
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
    }
});
