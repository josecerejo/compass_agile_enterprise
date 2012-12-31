Ext.define("Compass.ErpForms.DynamicForms.DynamicRelatedComboBox",{
    extend:"Ext.form.field.ComboBox",
    alias:'widget.related_combobox',

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
                    load: function(store, records, options){
                        try { var record_value = self.ownerCt.getRecord().data[self.name]; }catch(e){}
                        if (!Ext.isEmpty(record_value)){
                            self.setValue(record_value);
                        }else if (!Ext.isEmpty(self.default_value)){
                            // self.value did not want to work for selecting default value so we use custom self.default_value
                            self.setValue(self.default_value);
                        }
                    }
                }
            })
        }, config);

        this.callParent([config]);
    }
});

Ext.define("Compass.ErpForms.DynamicForms.DynamicRelatedSearchBox",{
    extend:"Ext.form.field.ComboBox",
    alias:'widget.related_searchbox',

    constructor : function(config) {
        var self = this;

        config = Ext.apply({
            emptyText: (config.emptyText || 'Search'),
            valueField: 'id',
            triggerAction: 'all',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching results found.',
                // Custom rendering template for each item
                getInnerTpl: function() {
                    return config.display_template;
                }
            },
            displayTpl : Ext.create('Ext.XTemplate',
              '<tpl for=".">' +
                   config.display_template +
              '</tpl>'
            ),
            hideTrigger:true,
            typeAhead: (config.typeAhead || true),
            pageSize: (config.pageSize || 10),
            store: Ext.create('Ext.data.Store', {
                pageSize: (config.pageSize || 10),
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
                    load: function(store, records, options){
                        try { var record_value = self.ownerCt.getRecord().data[self.name]; }catch(e){}
                        if (!Ext.isEmpty(record_value)){
                            self.setValue(record_value);
                        }else if (!Ext.isEmpty(self.default_value)){
                            // self.value did not want to work for selecting default value so we use custom self.default_value
                            self.setValue(self.default_value);
                        }
                    }
                }
            })
        }, config);

        this.callParent([config]);
    }
});
