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
        var centerRegion = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.CenterRegion');
		this.centerRegion = centerRegion;
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
                        {
							iconCls:'btn-save',
							text:'Save',
                            handler:function(btn){
                                centerRegion.saveCurrent();
                            }
                        },
						{
							iconCls:'btn-save-all',
							text:'Save All',
                            handler:function(btn){
                                centerRegion.saveAll();    
                            }
                        },
						'->',
                        {
							iconCls:'btn-left-panel',
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
							iconCls:'btn-right-panel',
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
							iconCls:'btn-left-right-panel',
                            handler:function(btn){
                                var east = btn.up('window').down('knitkit_eastregion');
                                var west = btn.up('window').down('knitkit_westregion');
                                if(west.collapsed || east.collapsed){
									west.expand();
									east.expand();
								}
								else
								if(!west.collapsed && !east.collapsed){
									west.collapse(Ext.Component.DIRECTION_LEFT);
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
