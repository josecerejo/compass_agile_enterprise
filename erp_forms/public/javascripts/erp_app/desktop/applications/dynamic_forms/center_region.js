Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.CenterRegion",{
    extend:"Ext.panel.Panel",
    alias:'widget.dynamic_forms_centerregion',
  
    constructor : function(config) {
      this.workArea = Ext.create('Ext.tab.Panel',{
          id: 'dynamic_formsTabPanel',
          autoDestroy:true,
          region:'center'
      });
      
      config = Ext.apply({
          id:'dynamic_formsCenterRegion',
          autoDestroy:true,
          layout:'border',
          region:'center',
          split:true,
          items:[this.workArea]
      }, config);
      
      this.callParent([config]);
    }
});

