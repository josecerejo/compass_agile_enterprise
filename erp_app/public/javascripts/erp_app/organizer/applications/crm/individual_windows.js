var individualFormFields = [
    {
        xtype:'textfield',
        fieldLabel:'Enterprise Identifier',
        allowBlank:true,
        name:'enterprise_identifier'
    },
    {
        xtype:'textfield',
        fieldLabel:'Title',
        allowBlank:true,
        name:'current_personal_title'
    },
    {
        xtype:'textfield',
        fieldLabel:'First Name',
        allowBlank:false,
        name:'current_first_name'
    },
    {
        xtype:'textfield',
        fieldLabel:'Middle Name',
        allowBlank:true,
        name:'current_middle_name'
    },
    {
        xtype:'textfield',
        fieldLabel:'Last Name',
        allowBlank:false,
        name:'current_last_name'
    },
    {
        xtype:'textfield',
        fieldLabel:'Suffix',
        allowBlank:true,
        name:'current_suffix'
    },
    {
        xtype:'textfield',
        fieldLabel:'Nickname',
        allowBlank:true,
        name:'current_nickname'
    },
    {
        xtype:'textfield',
        fieldLabel:'Passport Number',
        allowBlank:true,
        name:'current_passport_number'
    },
    {
        xtype:'datefield',
        fieldLabel:'Passport Expiration Date',
        allowBlank:true,
        name:'current_passport_expire_date'
    },
    {
        xtype:'datefield',
        fieldLabel:'DOB',
        allowBlank:false,
        name:'birth_date'
    },
    {
        xtype:'combobox',
        fieldLabel:'Gender',
        store:Ext.create('Ext.data.Store', {
            fields:['v', 'k'],
            data:[
                {"v":"m", "k":"Male"},
                {"v":"f", "k":"Female"}
            ]
        }),
        displayField:'k',
        valueField:'v',
        name:'gender'
    },
    {
        xtype:'textfield',
        fieldLabel:'Total Yrs Work Exp',
        allowBlank:true,
        name:'total_years_work_experience'
    },
    {
        xtype:'textfield',
        fieldLabel:'Marital Status',
        allowBlank:true,
        name:'marital_status'
    },
    {
        xtype:'textfield',
        fieldLabel:'Social Security Number',
        allowBlank:true,
        name:'social_security_number'
    }
];

Ext.define("Compass.ErpApp.Organizer.Applications.Crm.AddIndividualWindow", {
	extend:"Ext.window.Window",
    alias:'widget.crm-addindividualwindow',
	title:'New Individual',
	layout:'fit',
	buttonAlign:'center',
	initComponent: function () {
		Ext.apply(this, {
	    	items: Ext.create('Ext.form.Panel', {
				items:individualFormFields,
				labelWidth:110,
				closeAction:'hide',
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
                    var window = button.up('crm-addindividualwindow');
                    var formPanel = window.down('form');
                    formPanel.getForm().submit({
                        reset:true,
                        params:{
                            party_type:'Individual'
                        },
                        waitMsg:'Creating Individual',
                        success:function (form, action) {
                            var response = Ext.decode(action.response.responseText);
                            Ext.Msg.alert("Status", response.message);
                            if (response.success) {
                                var individualName = response.individualName;
                                addIndividualWindow.hide();
                                var individualsSearchGrid = Ext.ComponentMgr.get('individualSearchGrid');
                                individualsSearchGrid.store.proxy.extraParams.party_name = individualName;
                                individualsSearchGrid.store.load();
                            }
                        },
                        failure:function (form, action) {
                            var message = 'Error adding individual';
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
                btn.up('crm-addindividualwindow').close();
            }
        }
    ]
});

var editIndividualFormFields = [
    {
        xtype:'hiddenfield',
        name:'id'
    },
    {
        xtype:'hiddenfield',
        name:'business_party_id'
    }
];


Ext.define("Compass.ErpApp.Organizer.Applications.Crm.EditIndividualWindow", {
	extend:"Ext.window.Window",
    alias:'widget.crm-editindividualwindow',
    layout:'fit',
    title:'Edit Individual',
    buttonAlign:'center',
    initComponent: function () {
		Ext.apply(this, {
	    	items: Ext.create('Ext.form.Panel', {
				items:individualFormFields.concat(editIndividualFormFields),
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
                    var window = button.up('crm-editindividualwindow');
                    var formPanel = window.down('form');
					var partyId = formPanel.getForm().findField('id').getValue();
                    formPanel.getForm().submit({
                        reset:false,
                        params:{
                            party_type:'Individual'
                        },
                        waitMsg:'Updating Individual',
                        success:function (form, action) {
                            var response = Ext.decode(action.response.responseText);
                            Ext.Msg.alert("Status", response.message);
                            if (response.success) {
                                updatePartyDetails(partyId);
                                editIndividualWindow.hide();
                                Ext.getCmp('individualSearchGrid').store.load();
                            }
                        },
                        failure:function (form, action) {
                            var message = 'Error updating individual';
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
                btn.up('crm-editindividualwindow').close();
            }
        }
    ]
});