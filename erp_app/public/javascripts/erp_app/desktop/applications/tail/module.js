Ext.define("Compass.ErpApp.Desktop.Applications.Tail",{
    extend:"Ext.ux.desktop.Module",
    id:'tail-win',
    init : function(){
        this.launcher = {
            text: 'Tail',
            iconCls:'icon-document_pulse',
            handler: this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
       var desktop = this.app.getDesktop();
        var win = desktop.getWindow('tail');
        if(!win){
            win = desktop.createWindow({
                id: 'tail',
                title:'Tail',
                width:1000,
                height:550,
                iconCls: 'icon-document_pulse',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items:[
					{
						xtype:'tail-tailpanel'
					}
				]
            });
        }
        win.show();
    }
});
