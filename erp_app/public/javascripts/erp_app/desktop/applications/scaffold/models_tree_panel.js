Ext.define("Compass.ErpApp.Desktop.Applications.Scaffold.ModelsTree",{
    extend:"Ext.tree.Panel",
    alias:'widget.scaffold_modelstreepanel',
    setWindowStatus : function(status){
        this.findParentByType('statuswindow').setStatus(status);
    },
    
    clearWindowStatus : function(){
        this.findParentByType('statuswindow').clearStatus();
    },

    constructor : function(config) {
        var self = this;

        var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: '/erp_app/desktop/scaffold/get_models.tree',
                reader:{
                    type:'json',
                    root:'names'
                }
            },
            root: {
                text: 'CompassAE Models',
                draggable:false
            },
            fields:[
                {name:'text'},
                {name:'iconCls'},
                {name:'model'},
                {name:'leaf'}
            ]
        });

        config = Ext.apply({
            store:store,
            animate:false,
            region:'west',
            autoScroll:true,
            enableDD:false,
            containerScroll: true,
            border: false,
            frame:true,
            width: 250,
            height: 300,
            listeners:{
                'itemclick':function(view, record){
                    if(!record.data.leaf){
                        self.initialConfig.scaffold.loadModel(record.data.model);
                    }
                },
                'contextmenu':function(node, e){
                    e.stopEvent();
                },
                render:function(){
                    this.getRootNode().expand();
                }
            }
        }, config);

        this.callParent([config]);
    }
});



