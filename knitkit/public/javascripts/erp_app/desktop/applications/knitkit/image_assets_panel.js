Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsPanel",{
  extend:"Ext.tab.Panel",
  alias:'widget.knitkit_ImageAssetsPanel',

  constructor : function(config) {
    this.websiteId = null;
    var self = this;
    self.module = config.module;

    this.sharedImageAssetsDataView = Ext.create("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView",{
      url: '/knitkit/erp_app/desktop/image_assets/shared/get_images'
    });
    this.websiteImageAssetsDataView = Ext.create("Compass.ErpApp.Desktop.Applications.Knitkit.ImageAssetsDataView",{
      url: '/knitkit/erp_app/desktop/image_assets/website/get_images'
    });

    this.sharedImageAssetsTreePanel = Ext.create("Compass.ErpApp.Shared.FileManagerTree",{
      region:'north',
      rootText:'Shared Images',
      collapsible:false,
      allowDownload:false,
      addViewContentsToContextMenu:false,
      showNewFileMenuItem:false,
      rootVisible:true,
      multiSelect:true,
      controllerPath:'/knitkit/erp_app/desktop/image_assets/shared',
      standardUploadUrl:'/knitkit/erp_app/desktop/image_assets/shared/upload_file',
      url:'/knitkit/erp_app/desktop/image_assets/shared/expand_directory',
      containerScroll: true,
      height:200,
      additionalContextMenuItems:[
      {
        nodeType:'leaf',
        text:'Insert image at cursor',
        iconCls:'icon-add',
        listeners:{
          scope:self,
          'click':function(){
            var node = this.sharedImageAssetsTreePanel.selectedNode;
            var imgTagHtml = '<img';
            if(!Ext.isEmpty(node.data.width) && !Ext.isEmpty(node.data.height)){
              imgTagHtml += (' width="'+node.data.width+'" height="'+node.data.height+'"');
            }
            imgTagHtml += ' alt="'+node.data.text+'" src="/download/'+node.data.text+'?path='+node.data.downloadPath+'" />';
            self.module.centerRegion.insertHtmlIntoActiveCkEditorOrCodemirror(imgTagHtml);
          }
        }
      }
      ],
      listeners:{
       'allowdelete':function(){
          return currentUser.hasCapability('delete','GlobalImageAsset');
        },
        'allowupload':function(){
          return currentUser.hasCapability('upload','GlobalImageAsset');
        },
        'itemclick':function(view, record, item, index, e){
          e.stopEvent();
          if(!record.data["leaf"]){
            var store = self.sharedImageAssetsDataView.getStore();
            store.load({
              params:{
                directory:record.data.id
              }
            });
          }
          else{
            return false;
          }
      },
      'fileDeleted':function(fileTreePanel, node){
        var store = self.sharedImageAssetsDataView.getStore();
        store.load({
          params:{
            directory:node.data.downloadPath
          }
        });
      },
      'fileUploaded':function(fileTreePanel, node){
        var store = self.sharedImageAssetsDataView.getStore();
        store.load({
          params:{
            directory:node.data.id
          }
        });
      },
      'downloadfile':function(fileTreePanel, node){
        window.open("/download/"+node.data.text+"?path=" + node.data.downloadPath+'&disposition=attachment','mywindow','width=400,height=200');
        return false;
      }      
    }
  });
  
    this.websiteImageAssetsTreePanel = Ext.create("Compass.ErpApp.Shared.FileManagerTree",{
      autoLoadRoot:false,
      region:'north',
      rootText:'Images',
      collapsible:false,
      allowDownload:false,
      addViewContentsToContextMenu:false,
      showNewFileMenuItem:false,
      rootVisible:true,
      multiSelect:true,
      controllerPath:'/knitkit/erp_app/desktop/image_assets/website',
      standardUploadUrl:'/knitkit/erp_app/desktop/image_assets/website/upload_file',
      url:'/knitkit/erp_app/desktop/image_assets/website/expand_directory',
      containerScroll: true,
      height:200,
      additionalContextMenuItems:[
      {
        nodeType:'leaf',
        text:'Insert image at cursor',
        iconCls:'icon-add',
        listeners:{
          scope:self,
          'click':function(){
            var node = this.websiteImageAssetsTreePanel.selectedNode;
            var imgTagHtml = '<img';
            if(!Ext.isEmpty(node.data.width) && !Ext.isEmpty(node.data.height)){
              imgTagHtml += (' width="'+node.data.width+'" height="'+node.data.height+'"');
            }
            imgTagHtml += ' alt="'+node.data.text+'" src="/download/'+node.data.text+'?path='+node.data.downloadPath+'" />';
            self.module.centerRegion.insertHtmlIntoActiveCkEditorOrCodemirror(imgTagHtml);
          }
        }
      }
      ],
      listeners:{
        'load':function(store, node, records){
          store.getRootNode().data.text = self.websiteName;
          self.websiteImageAssetsTreePanel.view.refresh();
        },        
        'itemclick':function(view, record, item, index, e){
          if(self.websiteId !== null){
            e.stopEvent();
            if(!record.data["leaf"]){
              var store = self.websiteImageAssetsDataView.getStore();
              store.load({
                params:{
                  directory:record.data.id,
                  website_id:self.websiteId
                }
              });
            }
            else{
              return false;
            }
          }
        },
        'fileDeleted':function(fileTreePanel, node){
          self.websiteImageAssetsDataView.getStore().load({
            params:{
              directory:node.data.downloadPath,
              website_id:self.websiteId
            }
          });
        },
        'fileUploaded':function(fileTreePanel, node){
          self.websiteImageAssetsDataView.getStore().load({
            params:{
              directory:node.data.id,
              website_id:self.websiteId
            }
          });
        },
        'downloadfile':function(fileTreePanel, node){
          window.open("/download/"+node.data.text+"?path=" + node.data.downloadPath+'&disposition=attachment','mywindow','width=400,height=200');
          return false;
        }
      }
    });

    var sharedImagesPanel = Ext.create('Ext.panel.Panel',{
      cls:'image-assets',
      region:'center',
      margins: '5 5 5 0',
      layout:'fit',
      items: this.sharedImageAssetsDataView
    });

    var websiteImagesPanel = Ext.create('Ext.panel.Panel',{
      cls:'image-assets',
      region:'center',
      margins: '5 5 5 0',
      layout:'fit',
      items: this.websiteImageAssetsDataView
    });

    var sharedImagesLayout =  Ext.create('Ext.panel.Panel',{
      layout: 'border',
      title:'Shared',
      items: [this.sharedImageAssetsTreePanel, sharedImagesPanel]
    });
	
    var websiteImagesLayout =  Ext.create('Ext.panel.Panel',{
      autoRender: true,
      layout: 'border',
      title:'Website',
      items: [this.websiteImageAssetsTreePanel, websiteImagesPanel],
      listeners:{
        scope:self,
        'show': function(panel){
          self.reloadWebsiteImageAssetsTreePanel(self.websiteId);
        }       
      }
    });

    this.selectWebsite = function(websiteId, websiteName){
      this.websiteId = websiteId;
      this.websiteName = websiteName;
    };

    this.reloadWebsiteImageAssetsTreePanel = function(websiteId){
      this.websiteImageAssetsTreePanel.extraPostData = {
        website_id:websiteId
      };
      this.websiteImageAssetsTreePanel.getStore().setProxy({
        type: 'ajax',
        url:'/knitkit/erp_app/desktop/image_assets/website/expand_directory',
        extraParams:{
          website_id:websiteId
        }
      });

      if (websiteId){
        while (delNode = this.websiteImageAssetsTreePanel.getRootNode().childNodes[0]) {
          this.websiteImageAssetsTreePanel.getRootNode().removeChild(delNode);
        }
        this.websiteImageAssetsTreePanel.getRootNode().expand();

        if (!this.websiteImageAssetsTreePanel.getStore().isLoading()){
          this.websiteImageAssetsTreePanel.getStore().load();
        }      
      }
    };

    var items = [];
    if (currentUser.hasCapability('view','GlobalImageAsset')){
        items.push(sharedImagesLayout);
    }

    if (currentUser.hasCapability('view','SiteImageAsset')){
        items.push(websiteImagesLayout);
    }

    config = Ext.apply({
      deferredRender:false,
      layout: 'fit',
      title:'Images',
      items: items,
      activeTab: 1,
      listeners:{
        afterrender: function(panel){
          // workaround for extJS rendering bug. set activetab 1 above and 0 afterrender
          panel.setActiveTab(0);
        }
      }
    }, config);

    this.callParent([config]);

  }
});
