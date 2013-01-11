Ext.define("Compass.ErpApp.Shared.ProfileManagementPanel", {
    extend:"Ext.Panel",
    alias:"widget.shared_profilemanagementpanel",

    constructor:function (config) {
        var self = this;
        this.emailForm = {
            xtype:'form',
            labelWidth:110,
            border:false,
            title:'Update Email',
            anchor:'100% 40%',
            bodyStyle:'padding:5px 5px 0',
            buttonAlign:'left',
            url:'/erp_app/shared/profile_management/update_email',
            items:[
                {
                    xtype:'textfield',
                    fieldLabel:'New Email',
                    allowBlank:false,
                    width:300,
                    value:currentUser.email,
                    name:'email'
                }
            ],
            buttons:[
                {
                    text:'Update',
                    listeners:{
                        'click':function (button) {
                            var formPanel = button.up('form');
                            formPanel.getForm().submit({
                                waitMsg:'Updating Email ...',
                                reset:false,
                                success:function (form, action) {
                                    var obj = Ext.decode(action.response.responseText);
                                    if (obj.success) {
                                        var newEmail = form.getValues().email;
                                        currentUser.email = newEmail;
                                    }
                                    else {
                                        Ext.Msg.alert("Error", obj.msg);
                                    }
                                },
                                failure:function (form, action) {
                                    var obj = Ext.decode(action.response.responseText);
                                    if (Compass.ErpApp.Utility.isBlank(obj.message)) {
                                        Ext.Msg.alert("Error", 'Error updating email.');
                                    }
                                    else {
                                        Ext.Msg.alert("Error", obj.message);
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        };

        this.passwordForm = {
            xtype:'form',
            border:false,
            labelWidth:110,
            title:'Update Password',
            anchor:'100% 60%',
            bodyStyle:'padding:5px 5px 0',
            buttonAlign:'left',
            url:'/users/update_password',
            defaults:{
                width:225
            },
            items:[
                {
                    xtype:'textfield',
                    fieldLabel:'Old Password',
                    allowBlank:false,
                    name:'old_password',
                    inputType:'password'
                },
                {
                    xtype:'textfield',
                    fieldLabel:'New Password',
                    allowBlank:false,
                    name:'password',
                    inputType:'password'
                },
                {
                    xtype:'textfield',
                    fieldLabel:'Confirm Password',
                    allowBlank:false,
                    name:'password_confirmation',
                    inputType:'password'
                }
            ],
            buttons:[
                {
                    text:'Update',
                    listeners:{
                        'click':function (button) {
                            var formPanel = button.findParentByType('form');
                            formPanel.getForm().submit({
                                waitMsg:'Updating password ...',
                                reset:true,
                                success:function (form, action) {
                                    var obj = Ext.decode(action.response.responseText);
                                    if (!obj.success) {
                                        Ext.Msg.alert("Error", obj.msg);
                                    }
                                },
                                failure:function (form, action) {
                                    var obj = Ext.decode(action.response.responseText);
                                    if (Compass.ErpApp.Utility.isBlank(obj.message)) {
                                        Ext.Msg.alert("Error", 'Error updating password.');
                                    }
                                    else {
                                        Ext.Msg.alert("Error", obj.message);
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        };

        config = Ext.apply({
            title:'Profile',
            layout:'anchor',
            items:[this.emailForm, this.passwordForm]
        }, config);

        this.callParent([config]);
    }
});



