Ext.define('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogItem', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'audit_log_id',
            type:'int'
        },
        {
            name:'value',
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
            name:'audit_log_item_type',
            type:'string'
        }

    ]
});

Ext.create('Ext.data.Store', {
    storeId:'audit-log-view-audit-log-item-store',
    model:'Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogItem',
    pageSize:15,
    start:0,
    remoteSort:true,
    proxy:{
        type:'ajax',
        url:'/erp_app/desktop/audit_log_viewer/items.json',
        extraParams:{
            audit_log_id:null
        },
        reader:{
            type:'json',
            root:'audit_log_items',
            totalProperty:'total_count'

        }
    }
});

Ext.define('Compass.ErpApp.Desktop.Applications.AuditLogViewer.AuditLogItemGrid', {
    alias:'widget.audit_log_viewer-audit_log_item_grid',
    extend:'Ext.grid.Panel',
    title:'Audit Log Items',
	autoScroll:true,
    store:Ext.getStore('audit-log-view-audit-log-item-store'),
    columns:[
        {
            header:'Audit Log Id',
            dataIndex:'audit_log_id',
            sortable:false,
            width:75
        },
        {
            header:'Log Item Id',
            dataIndex:'id',
            width:75
        },
        {
            header:'Audit Log Item Type',
            dataIndex:'audit_log_item_type',
            width:200
	    },
        {
            header:'Value',
            dataIndex:'value',
            sortable:false,
            width:300
        },
		{
            header:'Description',
            dataIndex:'description',
            sortable:false,
            width:200
	    },
        {
            header:'Created At',
            dataIndex:'created_at',
            renderer:function(value){return Ext.Date.format(value, 'm-d-Y');},
            width:100
        }

    ],
    viewConfig:{
        stripeRows:true
    }
});
