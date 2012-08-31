Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit",{
    extend:"Ext.ux.desktop.Module",
    id:'knitkit-win',
    init : function(){
        this.launcher = {
            text: 'KnitKit',
            iconCls:'icon-palette',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
        //***********************************************************
        //Might get rid of this or make it an option you can select
        var title = 'KnitKit-' + currentUser.description
        //***********************************************************
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('knitkit');
        this.centerRegion = new Compass.ErpApp.Desktop.Applications.Knitkit.CenterRegion();
        if(!win){
            win = desktop.createWindow({
                id: 'knitkit',
                title:title,
                autoDestroy:true,
                width:1200,
                height:550,
				maximized:true,
                iconCls: 'icon-palette',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                tbar:{
                    items:[
                        '->',
                        {
                            text:'Left Panel',
                            handler:function(btn){
                                var panel = btn.up('window').down('knitkit_westregion');
                                if(panel.collapsed){
                                    panel.expand();
                                }
                                else{
                                    panel.collapse(Ext.Component.DIRECTION_LEFT);
                                }
                            }
                        },
                        {
                            text:'Right Panel',
                            handler:function(btn){
                                var panel = btn.up('window').down('knitkit_eastregion');
                                if(panel.collapsed){
                                    panel.expand();
                                }
                                else{
                                    panel.collapse(Ext.Component.DIRECTION_RIGHT);
                                }
                            }
                        },
                        {
                            text:'No Panel',
                            handler:function(btn){
                                var east = btn.up('window').down('knitkit_eastregion');
                                var west = btn.up('window').down('knitkit_westregion');
                                if(west.collapsed){
                                    west.expand();
                                }
                                else{
                                    west.collapse(Ext.Component.DIRECTION_LEFT);
                                }
                                if(east.collapsed){
                                    east.expand();
                                }
                                else{
                                    east.collapse(Ext.Component.DIRECTION_RIGHT);
                                }

                            }
                        }
                    ]
                },
                items:[
                this.centerRegion,
                {
                    xtype:'knitkit_eastregion',
                    module:this
                },
                {
                    xtype:'knitkit_westregion',
                    centerRegion:this.centerRegion,
                    module:this
                }
            ]
            });
        }
        win.show();
    }
});
