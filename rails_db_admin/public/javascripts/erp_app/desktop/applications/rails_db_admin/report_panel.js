Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.ReportPanel", {
    extend:"Ext.tab.Panel",
    alias:'widget.railsdbadmin_reportpanel',

    initComponent:function () {
        var me = this;

        var codeMirror = Ext.create("widget.codemirror", {
            title:'Template',
            disableSave:true,
            parser:'rb',
            sourceCode:me.initialConfig.template
        });

        var queryPanel = Ext.create('widget.railsdbadmin_querypanel',{
            title:'Query',
            hideSave:true,
            closable:false,
            module:me.initialConfig.module,
            sqlQuery:me.initialConfig.query
        });

        this.items = [queryPanel, codeMirror];

        this.tbar = {
            items:[
                {
                    text:'Save Report',
                    iconCls:'icon-save',
                    handler:function(btn){
                        var template, query = null;

                        //need to show all tabs to make sure codemirror fully rendered.
                        var tabPanel = btn.up('railsdbadmin_reportpanel');
                        activeTab = tabPanel.getActiveTab();
                        tabPanel.setActiveTab(1);
                        tabPanel.setActiveTab(0);
                        tabPanel.setActiveTab(activeTab);

                        template = codeMirror.getValue();
                        query = queryPanel.getSql();

                        var waitMsg = Ext.Msg.wait("Saving Report...", "Status");
                        Ext.Ajax.request({
                            url:'/rails_db_admin/erp_app/desktop/reports/save',
                            params:{
                                id:me.initialConfig.reportId,
                                template:template,
                                query:query
                            },
                            success:function (responseObject) {
                                waitMsg.close();
                                var obj = Ext.decode(responseObject.responseText);
                                if (!obj.success) {
                                    Ext.Msg.alert('Status', 'Error saving report');
                                }
                            },
                            failure:function () {
                                waitMsg.close();
                                Ext.Msg.alert('Status', 'Error saving report');
                            }
                        });
                    }
                },
                {
                    text:'Execute Report',
                    iconCls:'icon-settings',
                    handler:function(btn){
                        var webNavigator = window.compassDesktop.getModule('web-navigator-win');
                        webNavigator.createWindow('/reports/display/'+me.initialConfig.internalIdentifier);
                    }
                }
            ]
        };

        this.callParent(arguments);
    }
});