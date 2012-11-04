Ext.define("Compass.ErpForms.DynamicForms.DynamicFormPanel",{
    extend:"Ext.form.Panel",
    alias:'widget.dynamic_form_panel',

    // CALLBACK USAGE EXAMPLE:
    // 'afterrender':function(panel){
    //     panel.query('dynamic_form_panel').first().addListener('afterupdate', function(){
    //         console.log('afterupdate');
    //     });
    // } 
    initComponent: function() {
        this.callParent(arguments);
        this.addEvents(
          'aftercreate',
          'afterupdate'
        );
    },

    constructor : function(config) {
        this.callParent([config]);
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms",{
    extend:"Ext.ux.desktop.Module",
    id:'dynamic_forms-win',
    init : function(){
        this.launcher = {
            text: 'Dynamic Forms',
            iconCls:'icon-document',
            handler: this.createWindow,
            scope: this
        };
    },

    createWindow : function(){
       var desktop = this.app.getDesktop();
        var win = desktop.getWindow('dynamic_forms');
        this.centerRegion = new Compass.ErpApp.Desktop.Applications.DynamicForms.CenterRegion();                
        if(!win){
            win = desktop.createWindow({
                id: 'dynamic_forms',
                title:'Dynamic Forms',
                maximized:true,
                iconCls: 'icon-document',
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                items:[this.centerRegion,{
                    xtype:'dynamic_forms_westregion',
                    centerRegion:this.centerRegion,
                    module:this
                }]
            });
        }
        win.show();
    }
});
