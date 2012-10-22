Ext.define("Compass.ErpApp.Login.Window",{
  extend:"Ext.window.Window",
  alias:"compass.erpapp.login.window",
  requires:["Ext.Window"],
  layout:'fit',
  width:300,
  height:300,
  defaultButton:'login',
  buttonAlign:'center',
  closable:false,
  plain: true,
  submitForm:function(){
    var form = this.query('form')[0];
    var basicForm = form.getForm();
    var loginTo = form.getValues().loginTo;
    if(basicForm.isValid()){
      basicForm.submit({
        waitMsg: 'Authenticating User...',
        success:function(form, action){
          var result = Ext.decode(action.response.responseText);
          if(result.success){
            window.location = loginTo;
          }
          else{
            Ext.Msg.alert("Error", "Login failed. Try again");
          }
        },
        failure:function(form, action){
          Ext.Msg.alert("Error", "Login failed. Try again");
        }
      });
    }
  },
  constructor: function(config){
    this.applicationContainerCombo = Ext.create('Ext.form.field.ComboBox',{
      width: 250,
      fieldLabel:'Login To',
      allowBlank:false,
      forceSelection:true,
      editable:false,
      id:'loginTo',
      name:'loginTo',
      store:config.appContainers
    });
    
    var formPanel = Ext.create("Ext.FormPanel",{
      labelWidth: 75,
      frame:false,
      bodyStyle:'padding:5px 5px 0',
      url:'/session/sign_in',
      fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side'
      },
      items: [
      {
        xtype:'label',
        cls:'error_message',
        text:config.message
      },
      this.applicationContainerCombo,
      {
        xtype:'textfield',
        fieldLabel:'Username or Email Address',
        width: 250,
        allowBlank:false,
        id:'login',
        name:'login',
        listeners: {
          'specialkey': function(field, e){
            if (e.getKey() == e.ENTER) {
              this.up('window').submitForm();
            }
          }
        }
      },
      {
        xtype:'textfield',
        fieldLabel:'Password',
        inputType: 'password',
        width: 250,
        allowBlank:false,
        id:'password',
        name:'password',
        listeners: {
          'specialkey': function(field, e){
            if (e.getKey() == e.ENTER) {
              this.up('window').submitForm();
            }
          }
        }
      }
      ]
    });
	    
    config = Ext.apply({
      title:'Compass AE Single Sign On' || config['title'],
      items:formPanel,
      buttons: [{
        text:'Submit',
        listeners:{
          'click':function(button){
            this.up('window').submitForm();
          }
        }
      }]
    }, config);
    this.callParent([config]);
  },
  initComponent:function(){
    this.callParent(arguments);
    this.applicationContainerCombo.setValue(this.initialConfig.selectedAppContainerValue);
  }
});