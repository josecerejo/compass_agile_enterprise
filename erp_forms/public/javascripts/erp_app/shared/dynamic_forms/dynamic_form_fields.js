Ext.define("Compass.ErpApp.Shared.DynamicRelatedComboBox",{
    extend:"Ext.form.field.ComboBox",
    alias:'widget.related_combobox',
    initComponent: function() {
        //var config = this.initialConfig;
        this.callParent(arguments);
    },

    constructor : function(config) {

        config = Ext.apply({
            width: config['width'],
            loadingText:'Retrieving Options...',
            displayField: config['displayField'],
            valueField:'id',
            triggerAction: 'all',
            allowBlank: config['allowBlank'],
            store: Ext.create('Ext.data.Store', {
                fields:config['fields'],
                //remoteSort:config['remoteSort'],
                proxy: {
                        type:'ajax',
                        reader:{
                            type:'json',
                            root:'data'
                        },
                        extraParams: config['extraParams'],
                        url: config['url']
                    },
                //storeId: config['storeId'],
                autoLoad: true
            })
        }, config);

        this.callParent([config]);
    }
});
