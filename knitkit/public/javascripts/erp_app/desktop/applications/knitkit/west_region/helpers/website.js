Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteOptions = function (self, items, record) {
    items.push({
        text:'Configure',
        iconCls:'icon-gear',
        listeners:{
            'click':function () {
                self.updateWebsiteConfiguration(record);
            }
        }
    });

    if (currentUser.hasApplicationCapability('knitkit', {
        capability_type_iid:'publish',
        resource:'Website'
    })) {
        items.push({
            text:'Publish',
            iconCls:'icon-document_up',
            listeners:{
                'click':function () {
                    self.publish(record);
                }
            }
        });
    }

    items.push({
        text:'Publications',
        iconCls:'icon-documents',
        listeners:{
            'click':function () {
                self.getPublications(record);
            }
        }
    });

    items.push({
        text:'View Inquiries',
        iconCls:'icon-document',
        listeners:{
            'click':function () {
                self.initialConfig['centerRegion'].viewWebsiteInquiries(record.data.id.split('_')[1], record.data.title);
            }
        }
    });

    if (currentUser.hasApplicationCapability('knitkit', {
        capability_type_iid:'edit',
        resource:'Website'
    })) {
        items.push({
            text:'Update Website',
            iconCls:'icon-edit',
            listeners:{
                'click':function () {
                    var editWebsiteWindow = Ext.create("Ext.window.Window", {
                        title:'Update Website',
                        plain:true,
                        buttonAlign:'center',
                        items:Ext.create("Ext.form.Panel", {
                            labelWidth:110,
                            frame:false,
                            bodyStyle:'padding:5px 5px 0',
                            url:'/knitkit/erp_app/desktop/site/update',
                            defaults:{
                                width:225
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Name',
                                    allowBlank:false,
                                    name:'name',
                                    value:record.data['name']
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Title',
                                    id:'knitkitUpdateSiteTitle',
                                    allowBlank:false,
                                    name:'title',
                                    value:record.data['title']
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Sub Title',
                                    allowBlank:true,
                                    name:'subtitle',
                                    value:record.data['subtitle']

                                },
                                {
                                    xtype:'hidden',
                                    name:'id',
                                    value:record.data.id.split('_')[1]
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
                                        self.setWindowStatus('Updating website...');
                                        formPanel.getForm().submit({
                                            success:function (form, action) {
                                                self.clearWindowStatus();
                                                record.data['name'] = form.findField('name').getValue();
                                                record.data['title'] = form.findField('title').getValue();
                                                record.data['subtitle'] = form.findField('subtitle').getValue();
                                                record.data['email'] = form.findField('email').getValue();
                                                //node.setText(node.attributes['title']);
                                                editWebsiteWindow.close();
                                            },
                                            failure:function (form, action) {
                                                self.clearWindowStatus();
                                                Ext.Msg.alert("Error", "Error updating website");
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text:'Close',
                                handler:function () {
                                    editWebsiteWindow.close();
                                }
                            }
                        ]
                    });
                    editWebsiteWindow.show();
                }
            }
        });
    }

    if (currentUser.hasApplicationCapability('knitkit', {
        capability_type_iid:'delete',
        resource:'Website'
    })) {
        items.push({
            text:'Delete',
            iconCls:'icon-delete',
            listeners:{
                'click':function () {
                    self.deleteSite(record);
                }
            }
        });
    }

    items.push({
        text:'Export',
        iconCls:'icon-document_out',
        listeners:{
            'click':function () {
                self.exportSite(record.data.id.split('_')[1]);
            }
        }
    });

    return items;
}