Ext.define("Compass.ErpApp.Desktop.Applications.CompassDrive.RespositoryTreePanel",{
  extend:"Ext.tree.Panel",
  alias:'widget.compassdrive-repositorytreepanel',
  store:{
    proxy: {
      type: 'ajax',
      url: '/compass_drive/erp_app/desktop/index'
    },
    root: {
      text:'Repository'
    },
    fields:[
    {
      name:'modelId',
      type:'int'
    },
    {
      name:'text',
      type:'string'
    },
    {
      name:'iconCls',
      type:'string'
    },
    {
      name:'leaf',
      type:'boolean'
    },
    {
      name:'checkedOut',
      type:'boolean'
    },
    {
      name:'checkedOutBy',
      type:'string'
    },
    {
      name:'lastCheckoutOut',
      type:'date'
    }
    ]
  },
  listeners:{
    'itemclick':function(view, record, item, index, e, eOpts){
      var tabPanel = view.ownerCt.up('#compassDriveWindow').down('tabpanel');
      var grid = tabPanel.query(record.get('text'));
      if(Ext.isEmpty(grid)){
        grid = Ext.widget('compassdrive-versionsgridpanel',{
          itemId:record.get('text'),
          compassDriveAsset:record,
          title:record.get('text'),
          closable:true
        });
        tabPanel.add(grid);
      }
      
      tabPanel.setActiveTab(grid);
    },
    'itemcontextmenu':function(view, record, item, index, e, eOpts){
      e.stopEvent();
      var items = [];
      
      if(record.isRoot()){
        items.push({
          text:'Add File',
          iconCls:'icon-upload',
          listeners:{
            'click':function(){
              Ext.create("Compass.ErpApp.Shared.UploadWindow",{
                standardUploadUrl:'/compass_drive/erp_app/desktop/add_asset',
                xhrUploadUrl:'/compass_drive/erp_app/desktop/add_asset',
                extraPostData:{
                  category_id:null
                },
                listeners:{
                  'fileuploaded':function(){
                    record.store.load();
                  }
                }
              }).show();
            }
          }
        })
      }
      else
      {

        if(!record.get('checkedOut')){
          items.push({
            text:'Checkout',
            iconCls:'icon-document_down',
            listeners:{
              'click':function(){
                window.location = "/compass_drive/erp_app/desktop/checkout?id="+record.get('modelId');
              }
            }
          });
        }

        if(record.get('checkedOut') && currentUser.username == record.get('checkedOutBy')){
          items.push({
            text:'Checkin',
            iconCls:'icon-document_up',
            listeners:{
              'click':function(){
                Ext.create("Ext.window.Window",{
                  layout:'fit',
                  width:375,
                  title:'Checkin',
                  plain: true,
                  buttonAlign:'center',
                  items: Ext.create('widget.form',{
                    labelWidth: 110,
                    frame:false,
                    bodyStyle:'padding:5px 5px 0',
                    fileUpload: true,
                    url:'/compass_drive/erp_app/desktop/checkin',
                    defaults: {
                      width: 225
                    },
                    items: [
                    {
                      xtype:'fileuploadfield',
                      fieldLabel:'Checkin File',
                      width:300,
                      buttonText:'Upload',
                      buttonOnly:false,
                      allowBlank:true,
                      name:'asset_data'
                    },
                    {
                      fieldLabel:'Comment',
                      xtype:'textareafield',
                      height:300,
                      width:300,
                      allowBlank:true,
                      name:'comment'
                    },
                    {
                      xtype:'hidden',
                      name:'id',
                      value:record.get('modelId')
                    }
                    ]
                  }),
                  buttons: [{
                    text:'Submit',
                    listeners:{
                      'click':function(btn){
                        var form = btn.up('window').down('form').getForm();
                        if(form.isValid()){
                          form.submit({
                            waitMsg: 'Checking in...',
                            success:function(form, action){
                              record.store.load();
                            },
                            failure:function(form, action){
                              Ext.Msg.alert("Error", "Error checking in.");
                            }
                          });
                        }
                      }
                    }
                  },{
                    text: 'Close',
                    handler: function(btn){
                      btn.up('window').close();
                    }
                  }]
                }).show();
              }
            }
          });
        }

        items.push({
          text:'Delete',
          iconCls:'icon-delete',
          listeners:{
            'click':function(){
              Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this asset?', function(btn){
                if(btn == 'no'){
                  return false;
                }
                else
                if(btn == 'yes')
                {
                  var wait = Ext.Msg.wait('Status', 'Deleting asset...');
                  Ext.Ajax.request({
                    url:'/compass_drive/erp_app/desktop/delete_asset',
                    params:{
                      id:record.get('modelId')
                    },
                    success: function(response) {
                      wait.close();
                      var obj =  Ext.decode(response.responseText);
                      if(obj.success){
                        record.remove(true);
                      }
                      else{
                        Ext.Msg.alert('Error', 'Error deleting asset');
                      }
                    },
                    failure: function(response) {
                      wait.close();
                      Ext.Msg.alert('Error', 'Error deleting asset');
                    }
                  });
                }
              });
            }
          }
        });
      }

      Ext.create("Ext.menu.Menu",{
        items:items
      }).showAt(e.xy);
    }
  },
  constructor: function(config) {

    this.callParent([config]);
  }
});

