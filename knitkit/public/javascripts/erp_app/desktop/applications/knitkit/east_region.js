Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.EastRegion",{
    extend:"Ext.tab.Panel",
    alias:'widget.knitkit_eastregion',
    
    constructor : function(config) {
        this.imageAssetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsPanel', { module: config.module });
        this.widgetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.WidgetsPanel', { module: config.module });
        this.fileAssetsPanel = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.FileAssetsPanel', { module: config.module });
        this.items = [];

        if (currentUser.hasCapability('view','GlobalImageAsset') || currentUser.hasCapability('view','SiteImageAsset')){
            this.items.push(this.imageAssetsPanel.layout);
        }

        if (currentUser.hasCapability('view','GlobalFileAsset') || currentUser.hasCapability('view','SiteFileAsset')){
            this.items.push(this.fileAssetsPanel.layout);
        }
        
        this.items.push(this.widgetsPanel.layout);

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
