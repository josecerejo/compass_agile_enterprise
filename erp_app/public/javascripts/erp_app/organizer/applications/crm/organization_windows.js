var organizationFormFields = [
    {
        xtype:'textfield',
        fieldLabel:'Enterprise Identifier',
        allowBlank:true,
        name:'enterprise_identifier'
    },
    {
        xtype:'textfield',
        fieldLabel:'Tax ID',
        allowBlank:true,
        name:'tax_id_number'
    },
    {
        xtype:'textfield',
        fieldLabel:'Description',
        allowBlank:true,
        name:'description'
    }
];

var editOrganizationFormFields = [
    {
        xtype:'hiddenfield',
        name:'id'
    },
    {
        xtype:'hiddenfield',
        name:'business_party_id'
    }
];

Ext.define("Compass.ErpApp.Organizer.Applications.Crm.AddOrganizationWindow", {
	extend:"Ext.window.Window",
    alias:'widget.crm-addorganizationwindow',
    layout:'fit',
    title:'New Organization',
    buttonAlign:'center',
	initComponent: function () {
		Ext.apply(this, {
	    	items: Ext.create('Ext.form.Panel', {
				items:organizationFormFields,
				labelWidth:110,
		        frame:false,
		        bodyStyle:'padding:5px 5px 0',
		        url:'/erp_app/organizer/crm/create_party',
		        defaults:{
		            width:225
		        }
			})
	   	});
	    this.callParent(arguments);
	},
    buttons:[
        {
            text:'Submit',
            listeners:{
                'click':function (button) {
                    var window = button.up('crm-editorganizationwindow');
                    var formPanel = window.down('form');
                    formPanel.getForm().submit({
                        reset:true,
                        waitMsg:'Creating Organization',
                        params:{
                            party_type:'Organization'
                        },
                        success:function (form, action) {
                            var response = Ext.decode(action.response.responseText);
                            Ext.Msg.alert("Status", response.message);
                            if (response.success) {
                                var organizationName = response.organizationName;
                                addOrganizationWindow.hide();
                                var organizationSearchGrid = Ext.ComponentMgr.get('organizationSearchGrid');
                                organizationSearchGrid.store.proxy.extraParams.party_name = organizationName;
                                organizationSearchGrid.store.load();
                            }
                        },
                        failure:function (form, action) {
                            var message = "Error adding organization";
                            if (action.response != null) {
                                var response = Ext.decode(action.response.responseText);
                                message = response.message;
                            }
                            Ext.Msg.alert("Status", message);
                        }
                    });
                }
            }
        },
        {
            text:'Close',
            handler:function (btn) {
                btn.up('crm-addorganizationwindow').close();
            }
        }
    ]
});

Ext.define("Compass.ErpApp.Organizer.Applications.Crm.EditOrganizationWindow", {
	extend:"Ext.window.Window",
    alias:'widget.crm-editorganizationwindow',
    layout:'fit',
    title:'Edit Organization',
    buttonAlign:'center',
	initComponent: function () {
		Ext.apply(this, {
	    	items: Ext.create('Ext.form.Panel', {
				items:organizationFormFields.concat(editOrganizationFormFields),
				id:'editOrganizationFormPanel',
		        labelWidth:110,
		        frame:false,
		        bodyStyle:'padding:5px 5px 0',
		        url:'/erp_app/organizer/crm/update_party',
		        defaults:{
		            width:225
		        }
			})
	   	});
	    this.callParent(arguments);
	},
    buttons:[
        {
            text:'Submit',
            listeners:{
                'click':function (button) {
                    partyId = Ext.getCmp('editOrganizationFormPanel').getForm().findField('id').getValue();

                    var window = button.up('crm-editorganizationwindow');
                    var formPanel = window.down('form');
                    formPanel.getForm().submit({
                        reset:true,
                        waitMsg:'Updating Organization',
                        params:{
                            party_type:'Organization'
                        },
                        success:function (form, action) {
                            var response = Ext.decode(action.response.responseText);
                            Ext.Msg.alert("Status", response.message);
                            if (response.success) {
                                updatePartyDetails(partyId);
                                var organizationName = response.organizationName;
                                editOrganizationWindow.hide();
                                var organizationSearchGrid = Ext.ComponentMgr.get('organizationSearchGrid');
                                organizationSearchGrid.store.proxy.extraParams.party_name = organizationName;
                                organizationSearchGrid.store.load();
                            }
                        },
                        failure:function (form, action) {
                            var message = "Error adding organization";
                            if (action.response != null) {
                                var response = Ext.decode(action.response.responseText);
                                message = response.message;
                            }
                            Ext.Msg.alert("Status", message);
                        }
                    });
                }
            }
        },
        {
            text:'Close',
            handler:function(btn){
                btn.up('crm-editorganizationwindow').close();
            }
        }
    ]
});