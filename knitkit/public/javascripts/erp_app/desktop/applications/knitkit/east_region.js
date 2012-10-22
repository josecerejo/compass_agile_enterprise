Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.EastRegion",{
    extend:"Ext.tab.Panel",
    alias:'widget.knitkit_eastregion',
    
    constructor : function(config) {
        this.imageAssetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsPanel', { module: config.module });
        this.widgetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.WidgetsPanel', { module: config.module });
        this.fileAssetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.FileAssetsPanel', { module: config.module });
        this.items = [];

        if (currentUser.hasApplicationCapability('knitkit', {
            capability_type_iid:'view',
            resource:'GlobalImageAsset'
        }) || currentUser.hasApplicationCapability('knitkit', {
            capability_type_iid:'view',
            resource:'SiteImageAsset'}))
        {
            this.items.push(this.imageAssetsPanel);
        }

        if (currentUser.hasApplicationCapability('knitkit', {
            capability_type_iid:'view',
            resource:'GlobalFileAsset'
        }) || currentUser.hasApplicationCapability('knitkit', {
            capability_type_iid:'view',
            resource:'SiteFileAsset'}))
        {
            this.items.push(this.fileAssetsPanel);
        }
        
        this.items.push(this.widgetsPanel);

        config = Ext.apply({
            deferredRender:false,
            itemId:'knitkitEastRegion',
            region:'east',
            width:300,
            split:true,
            collapsible:true,
            activeTab: 0
        }, config);

        this.callParent([config]);
    }
});
