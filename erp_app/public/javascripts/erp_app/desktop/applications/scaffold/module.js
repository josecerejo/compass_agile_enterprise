Ext.define("Compass.ErpApp.Desktop.Applications.Scaffold", {
    extend:"Ext.ux.desktop.Module",
    id:'scaffold-win',
    loadModel:function (modelName) {
        var dynamicGrid = this.modelsTabPanel.down('#'+modelName);
        if(Ext.isEmpty(dynamicGrid)){
            dynamicGrid = Ext.create('Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel', {
                closable:true,
                itemId:modelName,
                editable:true,
                title:modelName,
                setupUrl:'/erp_app/desktop/scaffold/setup/' + modelName,
                dataUrl:'/erp_app/desktop/scaffold/data/' + modelName,
                page:true,
                pageSize:30,
                displayMsg:'Displaying {0} - {1} of {2}',
                emptyMsg:'Empty'
            });
            this.modelsTabPanel.add(dynamicGrid);
        }

        this.modelsTabPanel.setActiveTab(dynamicGrid);
    },

    init:function () {
        this.launcher = {
            text:'Scaffold',
            iconCls:'icon-data',
            handler:this.createWindow,
            scope:this
        }
    },

    createWindow:function () {
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('scaffold');
        if (!win) {

            this.modelsTabPanel = Ext.create('Ext.tab.Panel',{region:'center',items:[]});

            win = desktop.createWindow({
                id:'scaffold',
                title:'Scaffold',
                width:1000,
                height:550,
                iconCls:'icon-data',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout:'border',
                items:[
                    {
                        xtype:'scaffold_modelstreepanel',
                        scaffold:this
                    },
                    this.modelsTabPanel
                ]
            });
        }
        win.show();
    }
});
