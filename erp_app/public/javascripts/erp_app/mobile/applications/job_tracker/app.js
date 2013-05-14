Ext.define('Compass.ErpApp.Mobile.JobTracker.Application', {
    extend: 'Ext.Carousel',
    xtype: 'compass-erpapp-mobile-jobtracker-application',
    selectedJob: null,
    config: {
        layout: 'card',
        listeners: {
            activate: function () {
                this.setActiveItem(0);
            }
        }
    },

    scheduleJob: function () {
        var me = this;
        this.setMasked({xtype: 'loadmask', message: 'scheduling job...'});

        Ext.Ajax.request({
            url: '/erp_app/desktop/job_tracker/schedule',
            method: 'POST',
            params: {
                id: this.selectedJob.get('id'),
                authenticity_token:Compass.ErpApp.AuthentictyToken
            },
            success: function (response) {
                me.setMasked(false);
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.store.load();
                    me.setActiveItem(0);
                }
                else {
                    Ext.Msg.alert('Error', 'Error scheduling job.');
                }
            },
            failure: function (response) {
                me.setMasked(false);
                Ext.Msg.alert('Error', 'Error scheduling job.');
            }
        });
    },

    unScheduleJob: function () {
        var me = this;
        this.setMasked({xtype: 'loadmask', message: 'Unscheduling job...'});

        Ext.Ajax.request({
            url: '/erp_app/desktop/job_tracker/unschedule',
            method: 'POST',
            params: {
                id: this.selectedJob.get('id'),
                authenticity_token:Compass.ErpApp.AuthentictyToken
            },
            success: function (response) {
                me.setMasked(false);
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.store.load();
                    me.setActiveItem(0);
                }
                else {
                    Ext.Msg.alert('Error', 'Error unscheduling job.');
                }
            },
            failure: function (response) {
                me.setMasked(false);
                Ext.Msg.alert('Error', 'Error unscheduling job.');
            }
        });
    },

    constructor: function (config) {
        this.store = Ext.create('Compass.ErpApp.Mobile.JobTracker.Store.Jobs', {
            storeId: 'jobtracker-jobstore'
        });
        this.store.load();

        config['items'] = [
            {

                xtype: 'toolbar',
                ui: 'light',
                iconMask:true,
                docked: 'top',
                items: [
                    {
                        text: 'Home',
                        ui: 'back',
                        handler: function (btn) {
                            btn.up('#mainContainer').setActiveItem('#home');
                        }
                    },
                    {
                        iconCls: 'refresh',
                        iconMask: true,
                        handler: function (btn) {
                            btn.up('compass-erpapp-mobile-jobtracker-application').store.load();
                        }
                    }
                ]
            },
            {

                xtype: 'list',
                store: 'jobtracker-jobstore',
                onItemDisclosure: true,
                itemTpl: [
                    '<tpl if="!scheduled">',
                    '<div style="float:right;margin-right:50px;"><img src="/images/erp_app/mobile/yellow_light.png" /></div>',
                    '<tpl elseif="next_run_at &gt; new Date()">',
                    '<div style="float:right;margin-right:50px;"><img src="/images/erp_app/mobile/green_light.png" /></div>',
                    '<tpl else>',
                    '<div style="float:right;margin-right:50px;"><img src="/images/erp_app/mobile/red_light.png" /></div>',
                    '</tpl>',
                    '<div class="contact"><strong>{job_name}</strong></div>',
                    '<tpl if="Ext.isEmpty(last_run_at)">',
                    '<div>Last run: N/A</div>',
                    '<tpl else>',
                    '<div>Last run: {last_run_at:date("m/d/Y g:i:s")}</div>',
                    '</tpl>',
                    '<tpl if="Ext.isEmpty(next_run_at)">',
                    '<div>Next run: N/A</div>',
                    '<tpl else>',
                    '<div>Next run: {next_run_at:date("m/d/Y g:i:s")}</div>',
                    '</tpl>'],
                listeners: {
                    disclose: function (me, record, target, e, eOpts) {
                        var app = me.up('compass-erpapp-mobile-jobtracker-application'),
                            details = app.down('#details');
                        details.setHtml(Compass.ErpApp.Mobile.JobTracker.Templates.jobDetails.apply(record.getData()));
                        app.setActiveItem(details);
                        app.selectedJob = record;
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
                                text: 'Schedule',
                                handler: function (btn) {
                                    var app = btn.up('compass-erpapp-mobile-jobtracker-application');
                                    if(Ext.isEmpty(app.selectedJob)){
                                        Ext.Msg.alert('Error', 'No job selected');
                                    }
                                    else{
                                        app.scheduleJob();
                                    }
                                }
                            },
                            {
                                text: 'UnSchedule',
                                handler: function (btn) {
                                    var app = btn.up('compass-erpapp-mobile-jobtracker-application');
                                    if(Ext.isEmpty(app.selectedJob)){
                                        Ext.Msg.alert('Error', 'No job selected');
                                    }
                                    else{
                                        app.unScheduleJob();
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
