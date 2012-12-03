Compass.ErpApp.Desktop.Applications.Knitkit.addHostOptions = function (self, items, record) {
    if (currentUser.hasCapability('edit','WebsiteHost')) {
        items.push({
            text:'Update',
            iconCls:'icon-edit',
            listeners:{
                'click':function () {
                    var updateHostWindow = Ext.create("Ext.window.Window", {
                        layout:'fit',
                        width:310,
                        title:'Update Host',
                        height:100,
                        plain:true,
                        buttonAlign:'center',
                        items:Ext.create("Ext.form.Panel", {
                            labelWidth:50,
                            frame:false,
                            bodyStyle:'padding:5px 5px 0',
                            width:425,
                            url:'/knitkit/erp_app/desktop/site/update_host',
                            defaults:{
                                width:225
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Host',
                                    id:'knitkitUpdateWebsiteHostHost',
                                    name:'host',
                                    value:record.data.host,
                                    allowBlank:false
                                },
                                {
                                    xtype:'hidden',
                                    name:'id',
                                    value:record.data.websiteHostId
                                }
                            ]
                        }),
                        buttons:[
                            {
                                text:'Submit',
                                listeners:{
                                    'click':function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('form')[0];
                                        self.setWindowStatus('Updating Host...');
                                        formPanel.getForm().submit({
                                            reset:false,
                                            success:function (form, action) {
                                                self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    var newHost = Ext.getCmp('knitkitUpdateWebsiteHostHost').getValue();
                                                    record.set('host', newHost);
                                                    record.set('text', newHost);
                                                    record.commit();
                                                    updateHostWindow.close();
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.msg);
                                                }
                                            },
                                            failure:function (form, action) {
                                                self.clearWindowStatus();
                                                Ext.Msg.alert("Error", "Error updating Host");
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text:'Close',
                                handler:function () {
                                    updateHostWindow.close();
                                }
                            }
                        ]
                    });
                    updateHostWindow.show();
                }
            }
        });
    }

    if (currentUser.hasCapability('delete','WebsiteHost')) {
        items.push({
            text:'Delete',
            iconCls:'icon-delete',
            listeners:{
                'click':function () {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Host?', function (btn) {
                        if (btn == 'no') {
                            return false;
                        }
                        else if (btn == 'yes') {
                            self.setWindowStatus('Deleting Host...');
                            Ext.Ajax.request({
                                url:'/knitkit/erp_app/desktop/site/delete_host',
                                method:'POST',
                                params:{
                                    id:record.data.websiteHostId
                                },
                                success:function (response) {
                                    self.clearWindowStatus();
                                    var obj = Ext.decode(response.responseText);
                                    if (obj.success) {
                                        record.remove(true);
                                    }
                                    else {
                                        Ext.Msg.alert('Error', 'Error deleting Host');
                                    }
                                },
                                failure:function (response) {
                                    self.clearWindowStatus();
                                    Ext.Msg.alert('Error', 'Error deleting Host');
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    return items;
};