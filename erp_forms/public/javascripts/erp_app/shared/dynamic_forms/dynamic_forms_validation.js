function validate_regex(v, pattern){
    var regex = new RegExp(pattern);
    return regex.test(v);          
}

// fix for clearing emptyText in FF and Chrome
try{
  Ext.onReady( function(){
      if ( Ext.isGecko || Ext.isWebkit ) Ext.supports.Placeholder = false;
  });
}catch(e){}
