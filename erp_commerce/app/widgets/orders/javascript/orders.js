Compass.ErpApp.Widgets.Orders = {
    template: new Ext.Template("<%= render_widget :orders %>"),
    add:function(){
        Ext.getCmp('knitkitCenterRegion').addContentToActiveCodeMirror(Compass.ErpApp.Widgets.Orders.template.apply());
    }
}

Compass.ErpApp.Widgets.AvailableWidgets.push({
    name:'Orders',
    iconUrl:'/images/icons/package/package_48x48.png',
    onClick:Compass.ErpApp.Widgets.Orders.add
});