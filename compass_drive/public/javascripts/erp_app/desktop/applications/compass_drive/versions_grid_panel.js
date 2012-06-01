Ext.define("Compass.ErpApp.Desktop.Applications.CompassDrive.VersionsGridPanel", {
    extend:"Ext.grid.Panel",
    alias:'widget.compassdrive-versionsgridpanel',

    downloadVersion:function (rec) {
        window.location.assign('/compass_drive/erp_app/desktop/download_version?id=' + rec.get('id'));
    },

    viewComment:function (rec) {
        Ext.create('Ext.window.Window', {
            height:300,
            width:200,
            autoScroll:true,
            layout:'fit',
            items:[
                {
                    xtype:'panel',
                    layout:'fit',
                    itemId:'commentPanel',
                    autoLoad:{
                        url:'/compass_drive/erp_app/desktop/view_comment?id=' + rec.get('id')
                    }
                }
            ]
        }).show();
    },

    emailVersion:function(record){
        Ext.create('Ext.window.Window',{
            items: {
                xtype: 'form',
                labelWidth: 110,
                frame:false,
                bodyStyle:'padding:5px 5px 0',
                width: 425,
                url:'/compass_drive/erp_app/desktop/email_asset_version',
                defaults: {
                    width: 225
                },
                items: [
                    {
                        xtype:'textfield',
                        fieldLabel:'Email Address',
                        allowBlank:false,
                        width:400,
                        vtype: 'email',
                        name:'to_email'
                    },
                    {
                        xtype:'hiddenfield',
                        name:'id',
                        value:record.get('id')
                    }
                ]
            },
            buttons: [{
                text:'Submit',
                listeners:{
                    'click':function(button){
                        var window, formPanel;
                        window = button.up('window');
                        formPanel = window.down('form');
                        formPanel.getForm().submit({
                            waitMsg:'Emailing Document',
                            reset:true,
                            success:function(form, action){
                                var obj = Ext.decode(action.response.responseText);
                                if(obj.success){
                                    window.close();
                                    Ext.Msg.alert("Success", 'Email has been sent.');
                                }
                                else{
                                    Ext.Msg.alert("Error", 'Error sending email.');
                                }
                            },
                            failure:function(form, action){
                                Ext.Msg.alert("Error", 'Error sending email.');
                            }
                        });
                    }
                }
            },{
                text: 'Close',
                handler: function(btn){
                    var window = btn.up('window').close();
                }
            }]
        }).show();
    },

    initComponent:function () {
        this.callParent(arguments);
        this.getStore().load();
    },

    constructor:function (config) {
        var store = Ext.create('Ext.data.Store', {
            proxy:{
                type:'ajax',
                url:'/compass_drive/erp_app/desktop/versions',
                reader:{
                    type:'json',
                    root:'versions'
                },
                extraParams:{
                    id:config.compassDriveAsset.get('modelId')
                }
            },
            remoteSort:true,
            fields:[
                {
                    name:'id'
                },
                {
                    name:'version'
                },
                {
                    name:'checked_in_by'
                },
                {
                    name:'comment'
                },
                {
                    name:'created_at',
                    type:'date'
                }
            ]
        });

        config = Ext.apply({
            store:store,
            columns:[
                {
                    header:'Version',
                    dataIndex:'version',
                    sortable:true,
                    width:50
                },
                {
                    header:'Checked In At',
                    dataIndex:'created_at',
                    sortable:true,
                    renderer:Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
                    width:120
                },
                {
                    header:'Checked In By',
                    dataIndex:'checked_in_by',
                    width:200
                },
                {
                    menuDisabled:true,
                    resizable:false,
                    xtype:'actioncolumn',
                    header:'Download',
                    align:'center',
                    width:75,
                    items:[
                        {
                            icon:'/images/icons/document_down/document_down_16x16.png',
                            tooltip:'Download',
                            handler:function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                grid.ownerCt.downloadVersion(rec);
                            }
                        }
                    ]
                },
                {
                    menuDisabled:true,
                    resizable:false,
                    xtype:'actioncolumn',
                    header:'Comment',
                    align:'center',
                    width:75,
                    items:[
                        {
                            getClass:function (v, meta, rec) {  // Or return a class from a function
                                this.items[0].tooltip = rec.get('comment');
                                return 'info-col';
                            },
                            handler:function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                grid.ownerCt.viewComment(rec);
                            }
                        }
                    ]
                },
                {
                    menuDisabled:true,
                    resizable:false,
                    xtype:'actioncolumn',
                    header:'Email',
                    align:'center',
                    width:75,
                    items:[
                        {
                            icon:'/images/icons/mail/mail_16x16.png',
                            tooltip:'Email',
                            handler:function (grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                grid.ownerCt.emailVersion(rec);
                            }
                        }
                    ]
                }
            ],
            bbar:Ext.create("Ext.PagingToolbar", {
                pageSize:15,
                store:store,
                displayInfo:true,
                displayMsg:'{0} - {1} of {2}',
                emptyMsg:"Empty"
            })
        }, config);

        this.callParent([config]);
    }
});