Ext.ns("Compass.ErpApp.Widgets");

Compass.ErpApp.Widgets = {
  setup : function(uuid, name, action, params, addToLoaded){
    var widgetParams = {
      widget_params:Ext.encode(params)
    }
    Ext.Ajax.request({
      url: '/erp_app/widgets/'+name+'/'+action+'/'+uuid,
      method: 'POST',
      params:widgetParams,
      success: function(response) {
		Ext.get(uuid).dom.innerHTML = response.responseText;
        Compass.ErpApp.Utility.evaluateScriptTags(Ext.get(uuid).dom);
        Compass.ErpApp.JQuerySupport.setupHtmlReplace();
        if(addToLoaded)
          Compass.ErpApp.Widgets.LoadedWidgets.push({
            id:uuid,
            name:name,
            action:action,
            params:params
          });
      },
      failure: function(response) {
        jQuery('#'+uuid).unmask();
      }
    });
  },

  refreshWidgets : function(){
    Ext.each(Compass.ErpApp.Widgets.LoadedWidgets, function(widget){
      Compass.ErpApp.Widgets.setup(widget.id, widget.name, widget.action, widget.params, false);
    });
  },

  refreshWidget : function(name, action){
    Ext.each(Compass.ErpApp.Widgets.LoadedWidgets, function(widget){
      if(widget.name == name && widget.action == action){
        Compass.ErpApp.Widgets.setup(widget.id, widget.name, widget.action, widget.params, false);
      }
    });
  },

  setupAjaxNavigation : function(css_class, home_url){
    $.address.value('nav?url=' + home_url);

	var bindCss = 'a.'+css_class;
	var anchor = null;
    jQuery(bindCss).bind('click', function(){
        anchor = $(this);
		var href = anchor.attr('href');
        $.address.value('nav?url=' + href + '&key='+Compass.ErpApp.Utility.randomString(10));
        anchor.closest('div.compass_ae-widget').mask("Loading....");

        /*$.ajax({
            url: href,
            success: Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse
        });*/

        return false;
    });

    $.address.change(function(event) {
        try{
            if(!Ext.isEmpty(event.parameters.url)){
                $.ajax({
                    url: event.parameters.url,
                    success: Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse
                });
            }
        }
        catch(exception){
            if(console){
                console.log(exception);
            }
        }
    });
  },

  LoadedWidgets : [],

  AvailableWidgets : []
}

