if ($) {
    $(document).ready(function () {
        Compass.ErpApp.JQuerySupport.setupHtmlReplace();
    });

    Ext.ns("Compass.ErpApp.JQuerySupport");

    Compass.ErpApp.JQuerySupport.setupHtmlReplace = function () {
        jQuery('body').unbind('ajaxSuccess').bind('ajaxSuccess', Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse);
    };

    Compass.ErpApp.JQuerySupport.handleHtmlUpdateResponse = function (e, xhr, settings) {
        //reset SessionTimeout
        if(Compass.ErpApp.Utility.SessionTimeout.enabled){
            Compass.ErpApp.Utility.SessionTimeout.reset();
        }

        if(Compass.ErpApp.JQuerySupport.IsJsonString(xhr.responseText)){
            var responseData = jQuery.parseJSON(xhr.responseText);
            if (!Ext.isEmpty(responseData) && !Ext.isEmpty(responseData.htmlId)) {
                var updateDiv = $('#' + responseData.htmlId);
                try {
                    updateDiv.closest('div.compass_ae-widget').unmask();
                }
                catch (ex) {
                    //messy catch for no update div
                }
                updateDiv.get(0).innerHTML = responseData.html;
                Compass.ErpApp.Utility.evaluateScriptTags(updateDiv.get(0));
            }
        }
    };

    Compass.ErpApp.JQuerySupport.IsJsonString = function (str) {
        try {
            jQuery.parseJSON(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}