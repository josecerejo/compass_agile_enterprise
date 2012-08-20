Ext.define("Compass.ErpApp.Shared.UploadWindow",{
  extend:"Ext.window.Window",
  alias:'widget.erpappshared_uploadwindow',

  initComponent: function() {
    this.callParent(arguments);
    this.addEvents(
      /*** @event fileuploaded
         * Fired after file is uploaded.
         * @param {Compass.ErpApp.Shared.UploadWindow } uploadWindow This object
         */
      'fileuploaded'
      );
  },

  constructor : function(config) {
    if(Compass.ErpApp.Utility.isBlank(config)){
      config = {};
    }
    var self = this;
    
    var query_string = '?authenticity_token=' + Compass.ErpApp.AuthentictyToken
    if (config['extraPostData']['directory']){
      query_string += '&directory=' + config['extraPostData']['directory']
    }
    if (config['extraPostData']['website_id']){
      query_string += '&website_id=' + config['extraPostData']['website_id']
    }
    if (config['extraPostData']['product_type_id']){
      query_string += '&product_type_id=' + config['extraPostData']['product_type_id']
    }

    this.plUploader = new Ext.create("Ext.ux.panel.UploadPanel",{
      region:'center',
      url: (config['standardUploadUrl'] || './file_manager/base/upload_file') + query_string,
      max_file_size: ErpApp.FileUpload.maxSize,
      listeners:{
        scope:this,
        'uploadcomplete':function(pluploader, success, failed){
          if(success){
            this.fireEvent('fileuploaded', this);
            self.close();
          }else{
            return false;
          }
        }
      }
    });

    config = Ext.apply({
      title:'File Upload',
      layout:'border',
      autoWidth:true,
      height:300,
      width:800,
      iconCls:'icon-upload',
      items:[this.plUploader]
    }, config);

    this.callParent([config]);
  }

});