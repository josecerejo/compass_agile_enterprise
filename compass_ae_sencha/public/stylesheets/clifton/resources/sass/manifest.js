Ext.onReady(function() {
    Ext.manifest = {
        widgets: [
            {
                xtype: 'widget.button',
                ui   : 'primary'
            },
            {
                xtype: 'widget.button',
                ui   : 'tab-toolbar'
            },
            {
                xtype: 'widget.toolbar',
                ui   : 'default-clearheader'
            },
            {
                xtype: 'widget.window',
                ui   : 'default-collapsed'
            },
            {
                xtype: 'widget.tab',
                ui   : 'default',

            }
        ]
    };
});