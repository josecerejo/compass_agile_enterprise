Ext.define('Compass.ErpApp.Mobile.UserManagement.Application', {
    extend: 'Ext.Carousel',
    xtype: 'compass-erpapp-mobile-usermanagement-application',
    selectedUser: null,
    config: {
        listeners: {
            activate: function () {
                this.setActiveItem(0);
            }
        }
    },

    resetPassword: function () {
        var me = this;
        this.setMasked({xtype: 'loadmask', message: 'Resetting password...'});

        Ext.Ajax.request({
            url: '/users/reset_password',
            params: {
                login: this.selectedUser.get('email'),
                login_to: '/erp_app/mobile/login',
                authenticity_token:Compass.ErpApp.AuthentictyToken
            },
            success: function (response, opts) {
                me.setMasked(false);
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.Msg.alert("Success", "Password reset and email sent.");
                }
                else {
                    Ext.Msg.alert("Error", "Error re-setting password.");
                }
            },
            failure: function (response, opts) {
                me.setMasked(false);
                Ext.Msg.alert("Error", "Error re-setting password.");
            }
        });
    },

    constructor: function (config) {
        Ext.create('Compass.ErpApp.Mobile.UserManagement.Store.Users', {
            storeId: 'usermanagement-usersstore'
        }).load();

        config['items'] = [
            {

                xtype: 'toolbar',
                ui: 'light',
                docked: 'top',
                items: [
                    {
                        text: 'Home',
                        ui: 'back',
                        handler: function (btn) {
                            btn.up('#mainContainer').setActiveItem('#home');
                        }
                    }
                ]
            },
            {

                xtype: 'list',
                store: 'usermanagement-usersstore',
                itemTpl: '<div class="contact"><strong>{username}</strong></div>',
                grouped: true,
                indexBar: true,
                listeners: {
                    itemdoubletap: function (view, index, target, record, e, eOpts) {
                        e.stopEvent();
                        var carousel = view.up('carousel'),
                            details = carousel.down('#details');
                        details.setHtml(Compass.ErpApp.Mobile.UserManagement.Templates.userDetails.apply(record.getData()));
                        carousel.setActiveItem(details);
                        carousel.selectedUser = record;
                    }
                }
            },
            {
                itemId: 'details',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        items: [
                            {
                                text: 'Reset Password',
                                handler: function (btn) {
                                    var carousel = btn.up('carousel');

                                    if (Ext.isEmpty(carousel.selectedUser)) {
                                        Ext.Msg.alert('Error', 'No user selected');
                                    }
                                    else {
                                        carousel.resetPassword();
                                    }
                                }
                            }
                        ]
                    }
                ],
                layout: 'fit',
                autoScroll: true
            }


        ];

        this.callParent([config]);
    }
});
