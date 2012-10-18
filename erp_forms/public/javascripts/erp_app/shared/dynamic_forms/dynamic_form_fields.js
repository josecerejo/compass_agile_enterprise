Ext.define("Compass.ErpApp.Shared.DynamicRelatedComboBox",{
    extend:"Ext.form.field.ComboBox",
    alias:'widget.related_combobox',
    initComponent: function() {
        //var config = this.initialConfig;
        this.callParent(arguments);
    },

    constructor : function(config) {
        var self = this;

        config = Ext.apply({
            loadingText:'Retrieving Options...',
            displayField: config.displayField,
            valueField: 'id',
            triggerAction: 'all',
            store: Ext.create('Ext.data.Store', {
                fields: (config.fields || [{ name: 'id' }]),
                proxy: {
                    type:'ajax',
                    reader:{
                        type:'json',
                        root:'data'
                    },
                    extraParams: config.extraParams,
                    url: (config.url || '/erp_forms/erp_app/desktop/dynamic_forms/forms/related_field')
                },
                autoLoad: true,
                listeners:{
                    'load': function(store, records, options){
                        // self.value did not want to work for selecting default value so we use custom self.default_value
                        if (!Ext.isEmpty(self.default_value)) self.setValue(self.default_value);
                    }
                }
            })
        }, config);

        this.callParent([config]);
    }
});
