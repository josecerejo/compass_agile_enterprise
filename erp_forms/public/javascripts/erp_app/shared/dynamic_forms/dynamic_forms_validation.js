// we load vtypes here not because these methods are dependent on vtypes but rather because we want to load vtypes when validation loads
// we can't load vtypes when extjs loads because the vtypes depend on ErpTechSvcs.Config
// we want vtypes available to both knitkit and desktop and this file is already loaded both places
Compass.ErpApp.Utility.JsLoader.load(["/javascripts/extjs/vtypes.js"],function(){
  function validate_regex(v, pattern){
      var regex_style = /^\//
      if (regex_style.text(pattern)){
        var regex = eval(pattern);
      }else{
        var regex = new RegExp(pattern);  
      }      
      return regex.test(v);          
  }

  // fix for clearing emptyText in FF and Chrome
  try{
    Ext.onReady( function(){
        if ( Ext.isGecko || Ext.isWebkit ) Ext.supports.Placeholder = false;
    });
  }catch(e){}
});