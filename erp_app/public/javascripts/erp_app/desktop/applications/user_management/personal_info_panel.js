Ext.define("Compass.ErpApp.Desktop.Applications.UserManagement.PersonalInfoPanel",{
  extend:"Ext.Panel",
  alias:'widget.usermanagement_personalinfopanel',
  setWindowStatus : function(status){
    this.findParentByType('statuswindow').setStatus(status);
  },
    
  clearWindowStatus : function(){
    this.findParentByType('statuswindow').clearStatus();
  },
  
  constructor : function(config) {
    var form;
    var userInformationFieldset = {
      xtype:'fieldset',
      width:400,
      title:'User Information',
      items:[
      {
        xtype:'displayfield',
        fieldLabel:'Username',
        value:config['userInfo']['username']
      },
      {
        xtype:'displayfield',
        fieldLabel:'Email Address',
        value:config['userInfo']['email']
      },
      {
        xtype:'displayfield',
        fieldLabel:'Activation State',
        value:config['userInfo']['activation_state']
      },
      {
        xtype:'displayfield',
        fieldLabel:'Last Login',
        value:Ext.util.Format.date(config['userInfo']['last_login_at'],'F j, Y, g:i a')
      },
      {
        xtype:'displayfield',
        fieldLabel:'Last Activity',
        value:Ext.util.Format.date(config['userInfo']['last_activity_at'],'F j, Y, g:i a')
      },
      {
        xtype:'displayfield',
        fieldLabel:'# Failed Logins',
        value:config['userInfo']['failed_login_count']
      }
      ]
    }

    if(config['entityType'] == 'Organization'){
      form = new Ext.FormPanel({
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        width: 425,
        url:'/erp_app/desktop/contacts/create_party',
        items: [
        {
          xtype:'displayfield',
          width:400,
          title:config['entityType'] + ' Information',
          items:[
          {
            xtype:'textfield',
            fieldLabel:'Description',
            value:config['businessParty']['description']
          }
          ]
        },
        userInformationFieldset
        ]
      });
    }
    else{
      form = new Ext.FormPanel({
        frame:false,
        bodyStyle:'padding:5px 5px 0',
        width: 425,
        url:'/erp_app/desktop/contacts/create_party',
        items: [
        {
          xtype:'fieldset',
          width:400,
          title:config['entityType'] + ' Information',
          items:[
          {
            xtype:'displayfield',
            fieldLabel:'First Name',
            value:config['businessParty']['current_first_name']
          },
          {
            xtype:'displayfield',
            fieldLabel:'Last Name',
            value:config['businessParty']['current_last_name']
          },
          {
            xtype:'displayfield',
            fieldLabel:'Gender',
            value:config['businessParty']['gender']
          }
          ]
        },
        userInformationFieldset
        ]
      });
    }

    config = Ext.apply({
      items:[form],
      layout:'fit',
      title:'User Details'
    }, config);

    this.callParent([config]);
  }
});
