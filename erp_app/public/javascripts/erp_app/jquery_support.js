if($){
  $(document).ready(function () {
    Compass.ErpApp.JQuerySupport.setupHtmlReplace();
  });

  Ext.ns("Compass.ErpApp.JQuerySupport");

  Compass.ErpApp.JQuerySupport.setupHtmlReplace = function(){
    jQuery('body').unbind('ajaxSuccess').bind('ajaxSuccess', Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse);
  };

  Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse = function(e, xhr, settings){
  	var responseData = jQuery.parseJSON(xhr.responseText);
    if(!Ext.isEmpty(responseData) && !Ext.isEmpty(responseData.htmlId)){
		var updateDiv = $('#'+responseData.htmlId);  
		updateDiv.closest('div.compass_ae-widget').unmask(); 
    	updateDiv.get(0).innerHTML = responseData.html;
    	Compass.ErpApp.Utility.evaluateScriptTags(updateDiv.get(0));
  	}
  };
}