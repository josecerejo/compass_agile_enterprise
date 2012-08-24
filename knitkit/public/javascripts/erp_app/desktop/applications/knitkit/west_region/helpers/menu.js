Compass.ErpApp.Desktop.Applications.Knitkit.addMenuOptions = function (self, items, record) {
    if (record.data['canAddMenuItems']) {
        if (currentUser.hasApplicationCapability('knitkit', {
            capability_type_iid:'create',
            resource:'MenuItem'
        })) {
            items.push({
                text:'Add Menu Item',
                iconCls:'icon-add',
                handler:function (btn) {
                    var addMenuItemWindow = Ext.create("Ext.window.Window", {
                        layout:'fit',
                        width:375,
                        title:'New Menu Item',
                        height:175,
                        plain:true,
                        buttonAlign:'center',
                        items:Ext.create('Ext.form.Panel', {
                            labelWidth:50,
                            frame:false,
                            bodyStyle:'padding:5px 5px 0',
                            url:'/knitkit/erp_app/desktop/website_nav/add_menu_item',
                            defaults:{
                                width:225
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Title',
                                    allowBlank:false,
                                    name:'title'
                                },
                                {
                                    xtype:'combo',
                                    fieldLabel:'Link to',
                                    name:'link_to',
                                    id:'knitkit_nav_item_link_to',
                                    allowBlank:false,
                                    forceSelection:true,
                                    editable:false,
                                    autoSelect:true,
                                    typeAhead:false,
                                    mode:'local',
                                    triggerAction:'all',
                                    store:[
                                        ['website_section', 'Section'],
                                        ['url', 'Url']
                                    ],
                                    value:'website_section',
                                    listeners:{
                                        'change':function (combo, newValue, oldValue) {
                                            switch (newValue) {
                                                case 'website_section':
                                                    Ext.getCmp('knitkit_create_website_nav_item_section').show();
                                                    Ext.getCmp('knitkit_create_website_nav_item_url').hide();
                                                    break;
                                                case 'url':
                                                    Ext.getCmp('knitkit_create_website_nav_item_section').hide();
                                                    Ext.getCmp('knitkit_create_website_nav_item_url').show();
                                                    break;
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype:'combo',
                                    id:'knitkit_create_website_nav_item_section',
                                    hiddenName:'website_section_id',
                                    name:'website_section_id',
                                    width:300,
                                    loadingText:'Retrieving Sections...',
                                    store:Ext.create("Ext.data.Store", {
                                        proxy:{
                                            type:'ajax',
                                            url:'/knitkit/erp_app/desktop/section/existing_sections',
                                            reader:{
                                                type:'json'
                                            },
                                            extraParams:{
                                                website_id:record.data.websiteId
                                            }
                                        },
                                        autoLoad:true,
                                        fields:[
                                            {
                                                name:'id'
                                            },
                                            {
                                                name:'title_permalink'

                                            }
                                        ]
                                    }),
                                    forceSelection:true,
                                    editable:false,
                                    fieldLabel:'Section',
                                    autoSelect:true,
                                    typeAhead:false,
                                    mode:'local',
                                    displayField:'title_permalink',
                                    valueField:'id',

                                    triggerAction:'all'
                                },
                                {
                                    xtype:'textfield',
                                    fieldLabel:'Url',
                                    id:'knitkit_create_website_nav_item_url',
                                    hidden:true,
                                    name:'url'
                                },
                                {
                                    xtype:'hidden',
                                    name:'klass',
                                    value:((record.data['websiteNavId']) ? 'WebsiteNav' : 'WebsiteNavItem')
                                },
                                {
                                    xtype:'hidden',
                                    name:'id',
                                    value:record.data['websiteNavId'] || record.data['websiteNavItemId']
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
                                        self.setWindowStatus('Creating menu item...');
                                        formPanel.getForm().submit({
                                            reset:true,
                                            success:function (form, action) {
                                                self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    record.appendChild(obj.node);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.msg);
                                                }
                                            },
                                            failure:function (form, action) {
                                                self.clearWindowStatus();
                                                if (action.response == null) {
                                                    Ext.Msg.alert("Error", 'Could not create menu item');
                                                }
                                                else {
                                                    var obj = Ext.decode(action.response.responseText);
                                                    Ext.Msg.alert("Error", obj.msg);
                                                }

                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text:'Close',
                                handler:function () {
                                    addMenuItemWindow.close();
                                }
                            }
                        ]
                    });
                    addMenuItemWindow.show();
                }
            });
        }
    }

    return items;
}