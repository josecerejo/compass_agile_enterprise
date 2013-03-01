Compass.ErpApp.Widgets.Signup = {
    template: new Ext.Template('<%= render_widget :signup, :params => {:login_url => "/login"}%>'),
    addSignup:function(){
        Ext.getCmp('knitkitCenterRegion').addContentToActiveCodeMirror(Compass.ErpApp.Widgets.Signup.template.apply());
    }
}

Compass.ErpApp.Widgets.AvailableWidgets.push({
    name:'Signup',
    iconUrl:'/images/icons/user/user_48x48.png',
    onClick:Compass.ErpApp.Widgets.Signup.addSignup,
    about:'This widget allows new users of a website to sign up.'
});


