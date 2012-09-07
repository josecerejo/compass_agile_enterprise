Ext.define("Compass.ErpApp.Desktop.Applications.RailsDbAdmin.ReadOnlyTableDataGrid",{
  extend:"Ext.grid.GridPanel",
  alias:'widget.railsdbadmin_readonlytabledatagrid',
  constructor : function(config) {
    var jsonStore = new Ext.data.JsonStore({
      fields:config.fields,
      data:config.data
    });

    config = Ext.apply({
      store:jsonStore,
      autoScroll:true,
      height:'100%',
      loadMask:true
    }, config);
		
    this.callParent([config]);
  }
});





