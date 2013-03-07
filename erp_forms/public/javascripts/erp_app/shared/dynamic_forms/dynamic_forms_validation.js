// we load vtypes here not because these methods are dependent on vtypes but rather because we want to load vtypes when validation loads
// we can't load vtypes when extjs loads because the vtypes depend on ErpTechSvcs.Config
// we want vtypes available to both knitkit and desktop and this file is already loaded both places
new OnDemandLoadByAjax().load(["/javascripts/extjs/vtypes.js"], function() {});

function initRegex(pattern){
  var regex_style = /^\//;
  return (regex_style.test(pattern) ? eval(pattern) : new RegExp(pattern));
}

function validateRegex(v, pattern) {
  return initRegex(pattern).test(v);
}

function validateEmail(v) {
  return validateRegex(v, ErpTechSvcs.Config.email_regex);
}

// fix for clearing emptyText in FF and Chrome
try {
  Ext.onReady(function() {
    if(Ext.isGecko || Ext.isWebkit) Ext.supports.Placeholder = false;
  });
} catch(e) {}