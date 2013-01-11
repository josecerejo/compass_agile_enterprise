Ext.define("Compass.ErpApp.Organizer.Applications.Crm.Layout", {
    extend:"Ext.panel.Panel",
    alias:'widget.contactslayout',
    //private member partyId
    partyId:null,

    constructor:function (config) {
        config = Ext.apply({
            layout:'border',
            frame:false,
            autoScroll:true,
            region:'center',
            items:[]

        }, config);

        this.callParent([config]);
    }
});

Ext.define("Compass.ErpApp.Organizer.Applications.Crm.PartyPanel", {
    extend:"Ext.panel.Panel",
    alias:'widget.crmpartypanel',
    //private member partyId
    partyId:null,

    constructor:function (config) {
        this.partyId = config.partyId;
        var self = this;
        var currentPartyGrid = config.currentPartyGrid;
        var currentPartyPanel = config.currentPartyPanel;

        var toolBar = Ext.create("Ext.toolbar.Toolbar", {
            items:[
                {
                    text:'Edit',
                    xtype:'button',
                    iconCls:'icon-edit',
                    handler:function (button) {
                        var rec = currentPartyGrid.store.getById(self.partyId);
                        currentPartyGrid.fireEvent('editpartybtnclick', this, rec);
                    }
                },
                '|',
                {
                    text:'Delete',
                    xtype:'button',
                    iconCls:'icon-delete',
                    handler:function (button) {
                        var rec = currentPartyGrid.store.getById(self.partyId);
                        if (!rec) {
                            return false;
                        }
                        var messageBox = Ext.MessageBox.confirm(
                            'Confirm', 'Are you sure?',
                            function (btn) {
                                if (btn == 'yes') {
                                    currentPartyGrid.store.remove(rec);
                                    Ext.getCmp('party_id_' + self.partyId).close();
                                }
                            }
                        );
                    }
                }
            ]
        });

        config = Ext.apply({
            title:config.tabtitle,
            xtype:'panel',
            layout:'border',
            partyType:config.party_type,
            id:'party_id_' + config.partyId,
            tbar:toolBar,
            closable:true,
            split:true,
            items:[
                {
                    id:'party_details_' + config.partyId,
                    region:'center',
                    xtype:'panel',
                    html:''
                },
                {
                    height:300,
                    collapsible:true,
                    region:'south',
                    xtype:'tabpanel',
                    id:'panelSouthItems_' + config.partyId,
                    items:config.panelSouthItems
                }
            ]

        }, config);

        this.callParent([config]);
    }
});

Compass.ErpApp.Organizer.Applications.Crm.Base = function (config) {
    /**
     * load details of party
     */
    loadPartyDetails = function (partyId) {
        var widget_xtypes = [
            'phonenumbergrid',
            'emailaddressgrid',
            'postaladdressgrid',
            'shared_notesgrid'
        ];

        if (partyId == null) {
            Ext.Msg.alert('Error', 'Member partyId not set');
        }
        else {
            var tabPanel = Ext.getCmp('panelSouthItems_' + partyId);
            updatePartyDetails(partyId);
            Ext.getCmp('panelSouthItems_' + partyId).setActiveTab(0);

            for (i = 0; i < widget_xtypes.length; i += 1) {
                var widget = tabPanel.down(widget_xtypes[i]);
                if(!Ext.isEmpty(widget)){
                    widget.store.load();
                }
            }
        }
    };

    updatePartyDetails = function (partyId) {
        Ext.Ajax.request({
            url:'/erp_app/organizer/crm/get_party_details/' + partyId,
            disableCaching:false,
            method:'GET',
            success:function (response) {
                Ext.getCmp('party_details_' + partyId).update(response.responseText);
            }
        });
    };

    openPartyTab = function (partyId, party, party_type) {
        if (!party_type) {
            party_type = 'Individual';
        }
        if (party_type == 'Individual') {
            currentPartyPanel = Ext.getCmp('IndividualsCenterPanel');
            currentPartyGrid = Ext.getCmp('individualSearchGrid');
        } else {
            currentPartyPanel = Ext.getCmp('OrganizationsCenterPanel');
            currentPartyGrid = Ext.getCmp('organizationSearchGrid');
        }

        var panelSouthItems = [];
        var xtypes = [
            'phonenumbergrid',
            'emailaddressgrid',
            'postaladdressgrid',
            'shared_notesgrid'
        ];
		
		for (i = 0; i < xtypes.length; i += 1) {
            panelSouthItems.push({
              xtype:xtypes[i],
              partyId:partyId
            });
        }
		
        if (party_type == 'Individual') {
            var current_passport_expire_date = party.get('current_passport_expire_date');
            if (!Compass.ErpApp.Utility.isBlank(current_passport_expire_date)) {
                current_passport_expire_date = Ext.Date.format(current_passport_expire_date, 'm/d/Y');
            }

            tabtitle = party.get('current_first_name') + ' ' + party.get('current_last_name');
        }
        else {
            tabtitle = party.get('description');
        }

        var partyPanel = Ext.create("Compass.ErpApp.Organizer.Applications.Crm.PartyPanel", {
            party_type:party_type,
            panelSouthItems:panelSouthItems,
            tabtitle:tabtitle,
            party_details:'',
            partyId:partyId,
            currentPartyPanel:currentPartyPanel,
            currentPartyGrid:currentPartyGrid
        });

        currentPartyPanel.add(partyPanel);
        currentPartyPanel.setActiveTab('party_id_' + partyId);

        loadPartyDetails(partyId);
    };

    var treeMenuStore = Ext.create('Compass.ErpApp.Organizer.DefaultMenuTreeStore', {
        url:'/erp_app/organizer/crm/menu',
        rootText:'Customers',
        rootIconCls:'icon-content',
        additionalFields:[
            {
                name:'businessPartType'
            }
        ]
    });

    var menuTreePanel = {
        xtype:'defaultmenutree',
        title:'CRM',
        store:treeMenuStore,
        listeners:{
            scope:this,
            'itemcontextmenu':function (view, record, htmlItem, index, e) {
                e.stopEvent();
                if (record.isLeaf()) {
                    var contextMenu = null;
                    if (record.data.businessPartType == "individual") {
                        contextMenu = new Ext.menu.Menu({
                            items:[
                                {
                                    text:"Add Individual",
                                    iconCls:'icon-add',
                                    listeners:{
                                        'click':function () {
                                           Ext.create("Compass.ErpApp.Organizer.Applications.Crm.AddIndividualWindow").show();
                                        }
                                    }
                                }
                            ]
                        });
                    }
                    else if (record.data.businessPartType == "organization") {
                        contextMenu = new Ext.menu.Menu({
                            items:[
                                {
                                    text:"Add Organization",
                                    iconCls:'icon-add',
                                    listeners:{
                                        'click':function () {
                                            Ext.create("Compass.ErpApp.Organizer.Applications.Crm.AddOrganizationWindow").show();
                                        }
                                    }
                                }
                            ]
                        });
                    }
                    contextMenu.showAt(e.xy);
                }
            }
        }
    };

    var individualsGrid = {
        id:'individualSearchGrid',
        title:'Search',
        xtype:'partygrid',
        partyType:'Individual',
        listeners:{
            'addpartybtnclick':function (btn, grid) {
				Ext.create("Compass.ErpApp.Organizer.Applications.Crm.AddIndividualWindow").show();
            },
            'editpartybtnclick':function (btn, rec) {
                if (rec) {
					var editIndividualWindow = Ext.create("Compass.ErpApp.Organizer.Applications.Crm.EditIndividualWindow");
					editIndividualWindow.show();
					editIndividualWindow.down('form').getForm().loadRecord(rec);
                }
                else {
                    Ext.Msg.alert('Please select a record to edit.');
                }
            },
            'itemdblclick':function (view, record, item, index, e, options) {
                var partyId = record.get("id");
                var partyTab = Ext.getCmp('party_id_' + partyId);
                if (partyTab) {
                    Ext.getCmp('IndividualsCenterPanel').setActiveTab('party_id_' + partyId);
                }
                else {
                    openPartyTab(partyId, record, 'Individual');
                }
            }
        }
    };

    var organizationsGrid = {
        id:'organizationSearchGrid',
        title:'Search',
        xtype:'partygrid',
        partyType:'Organization',
        listeners:{
            'addpartybtnclick':function (btn, grid) {
            	Ext.create("Compass.ErpApp.Organizer.Applications.Crm.AddOrganizationWindow").show();
            },
            'editpartybtnclick':function (btn, rec) {
                //rec = grid.getSelectionModel().getSelection()[0];
                if (rec) {
                    var editIndividualWindow = Ext.create("Compass.ErpApp.Organizer.Applications.Crm.EditOrganizationWindow");
					editIndividualWindow.show();
					editIndividualWindow.down('form').getForm().loadRecord(rec);
                }
                else {
                    Ext.Msg.alert('Please select a record to edit.');
                }
            },
            'itemdblclick':function (view, record, item, index, e, options) {
                var partyId = record.get("id");
                var partyTab = Ext.getCmp('party_id_' + partyId);
                if (partyTab) {
                    Ext.getCmp('OrganizationsCenterPanel').setActiveTab('party_id_' + partyId);
                }
                else {
                    openPartyTab(partyId, record, 'Organization');
                }
            }
        }
    };

    var individualsPanel = {
        xtype:'contactslayout',
        id:'individuals_search_grid',
        title:'Individuals',
        items:[
            {
                xtype:'tabpanel',
                layout:'fit',
                region:'center',
                id:'IndividualsCenterPanel',
                items:[individualsGrid]
            }
        ]
    };

    var organizationsPanel = {
        xtype:'contactslayout',
        id:'organizations_search_grid',
        title:'Organizations',
        items:[
            {
                xtype:'tabpanel',
                layout:'fit',
                region:'center',
                id:'OrganizationsCenterPanel',
                items:[organizationsGrid]
            }
        ]
    };

    this.setup = function () {
        config.organizerLayout.addApplication(menuTreePanel, [individualsPanel, organizationsPanel]);
    };

};

