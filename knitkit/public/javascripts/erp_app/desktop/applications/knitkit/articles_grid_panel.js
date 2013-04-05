Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.ArticlesGridPanel",{
  extend:"Ext.grid.Panel",
  alias:'widget.knitkit_articlesgridpanel',
  deleteArticle : function(id){
    var self = this;
    this.initialConfig['centerRegion'].setWindowStatus('Deleting...');
    Ext.Ajax.request({
      url: '/knitkit/erp_app/desktop/articles/delete',
      method: 'POST',
      params:{id:id},
      success: function(response) {
        var obj = Ext.decode(response.responseText);
        if(obj.success){
          self.initialConfig['centerRegion'].clearWindowStatus();
          self.getStore().load();
        }
        else{
          Ext.Msg.alert('Error', 'Error deleting Article');
          self.initialConfig['centerRegion'].clearWindowStatus();
        }
      },
      failure: function(response) {
        self.initialConfig['centerRegion'].clearWindowStatus();
        Ext.Msg.alert('Error', 'Error deleting Article');
      }
    });
  },

  editArticle : function(record){
    var self = this;
    var itemId = 'editArticle-'+record.get('id');
    var editArticleWindow = Ext.ComponentQuery.query('#'+itemId).first();

    if(Compass.ErpApp.Utility.isBlank(editArticleWindow)){
      var editArticleWindow = Ext.create("Ext.window.Window",{
        layout:'fit',
        width:375,
        title:'Edit Article',
        itemId:itemId,
        // minimizable:true,
        plain: true,
        buttonAlign:'center',
        items: {
          xtype: 'form',
          labelWidth: 110,
          frame:false,
          bodyStyle:'padding:5px 5px 0',
          width: 425,
          url:'/knitkit/erp_app/desktop/articles/update/',
          defaults: {width: 225},
          items: [
          {
            xtype:'textfield',
            fieldLabel:'Title',
            allowBlank:false,
            name:'title',
            value: record.data.title
          },
          {
            xtype:'radiogroup',
            fieldLabel:'Display title?',
            name:'display_title',
            columns:2,
            items:[
            {
              boxLabel:'Yes',
              name:'display_title',
              inputValue: 'yes',
              checked:record.data.display_title
            },

            {
              boxLabel:'No',
              name:'display_title',
              inputValue:'no',
              checked:!record.data.display_title
            }]
          },
          {
            xtype:'textfield',
            fieldLabel:'Internal ID',
            allowBlank:true,
            name:'internal_identifier',
            value: record.data.internal_identifier
          },
          {
            xtype:'textfield',
            fieldLabel:'Tags',
            allowBlank:true,
            name:'tags',
            itemId: 'tag_list',
            value: record.data.tag_list
          },
          {
            xtype: 'displayfield',
            fieldLabel: 'Created At',
            name: 'created_at',
            value: record.data.created_at
          },
          {
            xtype: 'displayfield',
            fieldLabel: 'Updated At',
            name: 'updated_at',
            value: record.data.updated_at
          },        
          {
            xtype:'hidden',
            allowBlank:false,
            name:'id',
            itemId: 'record_id',
            value: record.data.id
          }
          ]
        },
        buttons: [{
          text:'Submit',
          listeners:{
            'click':function(button){
              var window = button.findParentByType('window');
              var formPanel = window.query('form')[0];
              self.initialConfig['centerRegion'].setWindowStatus('Updating article...');
              formPanel.getForm().submit({
                reset:false,
                success:function(form, action){
                  self.initialConfig['centerRegion'].clearWindowStatus();
                  var obj = Ext.decode(action.response.responseText);
                  if(obj.success){
                    self.getStore().load();
                    if(formPanel.getForm().findField('tag_list')){
                      var tag_list = formPanel.getForm().findField('tag_list').getValue();
                      record.set('tag_list', tag_list);
                    }
                    editArticleWindow.close();
                  }
                  else{
                    Ext.Msg.alert("Error", obj.msg);
                  }
                },
                failure:function(form, action){
                  self.initialConfig['centerRegion'].clearWindowStatus();
                  Ext.Msg.alert("Error", "Error updating article");
                }
              });
            }
          }
        },{
          text: 'Close',
          handler: function(){
            editArticleWindow.close();
          }
        }]
      });
    }
    editArticleWindow.show();
  },

  initComponent: function() {
    this.callParent(arguments);
    this.getStore().load();
  },

  constructor : function(config) {
    var self = this;

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
      storeId: 'knitkit_articlesgridpanelStore',
      pageSize: 20,
      proxy: {
        type: 'ajax',
        url:'/knitkit/erp_app/desktop/articles/all/',
        reader: {type: 'json', root: 'data'}
      },
      remoteSort: true,
      fields:[
        {name:'id'},
        {name:'title'},
        {name:'tag_list'},
        {name:'excerpt_html'},
        {name:'body_html'},
        {name:'sections'},
        {name:'internal_identifier'},
        {name:'display_title'},
        {name:'created_at'},
        {name:'updated_at'}
      ]
    });

var columnItems = [];

        columnItems.push(
        {
            header:'Title',
            sortable:true,
            dataIndex:'title',
            width:110,
            editable:false
        },
        {
            menuDisabled:true,
            resizable:false,
            xtype:'actioncolumn',
            header:'Sections',
            align:'center',
            width:50,
            items:[{
                iconCls:'actioncolumn_hover',
                getClass: function(v, meta, rec) {  // Or return a class from a function
                    this.items[0].tooltip = rec.get('sections');
                    return 'info-col';
                },
                handler :function(grid, rowIndex, colIndex){
                    return true;
                }
            }]
        });

        if (currentUser.hasCapability('edit','Content'))
        {
            columnItems.push(
            {
                menuDisabled:true,
                resizable:false,
                xtype:'actioncolumn',
                header:'Edit',
                align:'center',
                width:40,
                items:[{
                    icon:'/images/icons/edit/edit_16x16.png',
                    iconCls:'actioncolumn_hover',
                    tooltip:'Edit',
                    handler :function(grid, rowIndex, colIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        self.editArticle(rec);
                    }
                }]
            });
        }

        columnItems.push(
        {
            menuDisabled:true,
            resizable:false,
            xtype:'actioncolumn',
            header:'Comments',
            align:'center',
            width:60,
            items:[{
                icon:'/images/icons/document_text/document_text_16x16.png',
                iconCls:'actioncolumn_hover',
                tooltip:'Comments',
                handler :function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    self.initialConfig['centerRegion'].viewContentComments(rec.get('id'), rec.get('title') + ' - Comments');
                }
            }]
        });

        if (currentUser.hasCapability('edit_excerpt','Content'))
        {
            columnItems.push(
            {
                menuDisabled:true,
                resizable:false,
                xtype:'actioncolumn',
                header:'Excerpt',
                align:'center',
                width:50,
                items:[{
                    icon:'/images/icons/edit/edit_16x16.png',
                    iconCls:'actioncolumn_hover',
                    tooltip:'Edit Excerpt',
                    handler :function(grid, rowIndex, colIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        self.initialConfig['centerRegion'].editExcerpt(rec.get('title') + ' - Excerpt', rec.get('id'), rec.get('excerpt_html'), self.initialConfig.siteId);
                    }
                }]
            });
        }

        columnItems.push(
        {
            menuDisabled:true,
            resizable:false,
            xtype:'actioncolumn',
            header:'HTML',
            align:'center',
            width:40,
            items:[{
                icon:'/images/icons/edit/edit_16x16.png',
                iconCls:'actioncolumn_hover',
                tooltip:'Edit Content',
                handler :function(grid, rowIndex, colIndex){
                    var rec = grid.getStore().getAt(rowIndex);
                    self.initialConfig['centerRegion'].editContent(rec.get('title'), rec.get('id'), rec.get('body_html'), null, 'blog');
                }
            }]
        });

        if (currentUser.hasCapability('delete','Content'))
        {
            columnItems.push(
            {
                menuDisabled:true,
                resizable:false,
                xtype:'actioncolumn',
                header:'Delete',
                align:'center',
                width:40,
                items:[{
                    icon:'/images/icons/delete/delete_16x16.png',
                    iconCls:'actioncolumn_hover',
                    tooltip:'Delete',
                    handler :function(grid, rowIndex, colIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        var id = rec.get('id');
                        var messageBox = Ext.MessageBox.confirm(
                            'Confirm', 'Are you sure?',
                            function(btn){
                                if (btn == 'yes'){
                                    self.deleteArticle(id);
                                }
                            }
                        );
                    }
                }]
            }
            );
        }

        var tbarItems = [];

        if (currentUser.hasCapability('create','Content'))
        {
            tbarItems.push(
            {
                text: 'New Article',
                iconCls: 'icon-add',
                handler : function(){
                    var addArticleWindow = new Ext.Window({
                        layout:'fit',
                        width:375,
                        title:'New Article',
                        plain: true,
                        buttonAlign:'center',
                        items: new Ext.FormPanel({
                            labelWidth: 110,
                            frame:false,
                            bodyStyle:'padding:5px 5px 0',
                            width: 425,
                            url:'/knitkit/erp_app/desktop/articles/new/',
                            defaults: {width: 257},
                            items:[
                            {
                                xtype:'textfield',
                                fieldLabel:'Title',
                                allowBlank:false,
                                name:'title'
                            },
                            {
                                xtype:'radiogroup',
                                fieldLabel:'Display title?',
                                name:'display_title',
                                columns:2,
                                items:[
                                {
                                    boxLabel:'Yes',
                                    name:'display_title',
                                    inputValue: 'yes',
                                    checked:true
                                },

                                {
                                    boxLabel:'No',
                                    name:'display_title',
                                    inputValue: 'no'
                                }]
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'Internal ID',
                                allowBlank:true,
                                name:'internal_identifier'
                            },
                            {
                                xtype:'textfield',
                                fieldLabel:'Tags',
                                allowBlank:true,
                                name:'tags'
                                // id: 'tag_list'
                            }]
                        }),
                        buttons: [{
                            text:'Submit',
                            listeners:{
                                'click':function(button){
                                    var window = button.findParentByType('window');
                                    var formPanel = window.query('form')[0];
                                    self.initialConfig['centerRegion'].setWindowStatus('Creating article...');
                                    formPanel.getForm().submit({
                                        reset:true,
                                        success:function(form, action){
                                            self.initialConfig['centerRegion'].clearWindowStatus();
                                            var obj =  Ext.decode(action.response.responseText);
                                            if(obj.success){
                                                self.getStore().load();
                                            }
                                            else{
                                                Ext.Msg.alert("Error", obj.msg);
                                            }
                                            addArticleWindow.close();

                                        },
                                        failure:function(form, action){
                                            self.initialConfig['centerRegion'].clearWindowStatus();
                                            Ext.Msg.alert("Error", "Error creating article");
                                        }
                                    });
                                }
                            }
                        },{
                            text: 'Close',
                            handler: function(){
                                addArticleWindow.close();
                            }
                        }]
                    });
                    addArticleWindow.show();
                }
            },'|');
        }

        tbarItems.push(
        {
            xtype:'textfield',
            hideLabel:true,
            id:'global_article_search_field',
            width:75
        },
        {
            text: 'Search',
            iconCls: 'icon-search',
            handler: function(button) {
                var iid = Ext.getCmp('global_article_search_field').getValue();
                store.setProxy({ 
                    type: 'ajax',
                    url: '/knitkit/erp_app/desktop/articles/all/',
                    reader: {
                        type: 'json',
                        root: 'data',
                        idProperty: 'id',
                        totalProperty:'total'
                    },
                    extraParams:{iid:iid}
                });
                store.load();
            }
        },
        {
            text: 'Advanced',
            iconCls: 'icon-search',
            handler: function(){
                var advancedSearchWindow = new Ext.Window({
                    layout:'fit',
                    width:375,
                    title:'Advanced Search',
                    plain: true,
                    buttonAlign:'center',
                    items: new Ext.FormPanel({
                        labelWidth: 110,
                        frame:false,
                        bodyStyle:'padding:5px 5px 0',
                        width: 425,
                        defaults: {width: 257},
                        items:[
                        {
                            xtype:'textfield',
                            fieldLabel:'Title',
                            allowBlank:true,
                            name:'title',
                            id:'global_article_advanced_search_title'
                        },
                        {
                            xtype:'textfield',
                            fieldLabel:'Content',
                            allowBlank:true,
                            name:'content',
                            id:'global_article_advanced_search_content'
                        },
                        {
                            xtype:'fieldset',
                            border: false,
                            autoHeight: true,
                            title:'Created Between',
                            items: [{
                                xtype:'datefield',
                                fieldLabel: "Start",
                                name: 'created_start_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_created_start_date'
                            },
                            {
                                xtype:'datefield',
                                fieldLabel: "End",
                                name: 'created_end_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_created_end_date'
                            }]
                        },
                        {
                            xtype:'fieldset',
                            border: false,
                            autoHeight: true,
                            title:'Last Updated Between',
                            items: [{
                                xtype:'datefield',
                                fieldLabel: "Start",
                                name: 'updated_start_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_updated_start_date'
                            },
                            {
                                xtype:'datefield',
                                fieldLabel: "End",
                                name: 'updated_end_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_updated_end_date'
                            }]
                        },
                        {
                            xtype:'fieldset',
                            border: false,
                            autoHeight: true,
                            title:'Viewable Between',
                            items: [{
                                xtype:'datefield',
                                fieldLabel: "Start",
                                name: 'viewable_start_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_viewable_start_date'
                            },
                            {
                                xtype:'datefield',
                                fieldLabel: "End",
                                name: 'viewable_end_date',
                                allowBlank:true,
                                width: 230,
                                id:'global_article_advanced_search_viewable_end_date'
                            },
                            {
                                xtype:'radiogroup',
                                fieldLabel:'Show Articles Without Display Dates?',
                                columns:2,
                                id:'global_article_advanced_search_show_articles_without_display_dates',
                                items:[
                                {
                                    boxLabel:'Yes',
                                    name:'show_articles_without_display_dates',
                                    inputValue: 'true',
                                    checked:true
                                },
                                {
                                    boxLabel:'No',
                                    name:'show_articles_without_display_dates',
                                    inputValue: 'false'
                                }
                                ]
                            }]
                        },
                        {
                          xtype: 'checkbox',
                          fieldLabel: 'Show Orphaned Only',
                          id: 'show_orphaned_checkbox',
                          name: 'show_orphaned',
                          inputValue: 1,
                          uncheckedValue: 0

                        },
                        {
                            xtype:'radiogroup',
                            fieldLabel:'Archivable',
                            columns:2,
                            id:'global_article_advanced_search_archivable',
                            items:[
                            {
                                boxLabel:'Yes',
                                name:'archivable',
                                inputValue: 'true'
                            },
                            {
                                boxLabel:'No',
                                name:'archivable',
                                inputValue: 'false'
                            },
                            {
                                boxLabel:'Both',
                                name:'archivable',
                                inputValue: 'both',
                                checked:true
                            }]
                        }]
                    }),
                    buttons: [{
                        text:'Submit',
                        listeners:{
                            'click':function(button){
                                var title = Ext.getCmp('global_article_advanced_search_title').getValue();
                                var content = Ext.getCmp('global_article_advanced_search_content').getValue();
                                var created_start_date = Ext.getCmp('global_article_advanced_search_created_start_date').getValue();
                                var created_end_date = Ext.getCmp('global_article_advanced_search_created_end_date').getValue();
                                var updated_start_date = Ext.getCmp('global_article_advanced_search_updated_start_date').getValue();
                                var updated_end_date = Ext.getCmp('global_article_advanced_search_updated_end_date').getValue();
                                var viewable_start_date = Ext.getCmp('global_article_advanced_search_viewable_start_date').getValue();
                                var viewable_end_date = Ext.getCmp('global_article_advanced_search_viewable_end_date').getValue();
                                var show_articles_without_display_dates = Ext.getCmp('global_article_advanced_search_show_articles_without_display_dates').getValue();
                                var archivable = Ext.getCmp('global_article_advanced_search_archivable').getValue();
                                var show_orphaned = Ext.getCmp('show_orphaned_checkbox').getValue();
                                store.setProxy({
                                    type: 'ajax',
                                    url: '/knitkit/erp_app/desktop/articles/all/',
                                    reader: {
                                        type: 'json',
                                        root: 'data',
                                        idProperty: 'id',
                                        totalProperty:'total'
                                    },
                                    extraParams:{
                                        title:title,
                                        content:content,
                                        created_start_date:created_start_date,
                                        created_end_date:created_end_date,
                                        updated_start_date:updated_start_date,
                                        updated_end_date:updated_end_date,
                                        viewable_start_date:viewable_start_date,
                                        viewable_end_date:viewable_end_date,
                                        show_articles_without_display_dates:show_articles_without_display_dates,
                                        archivable:archivable,
                                        show_orphaned:show_orphaned
                                    }
                                });
                                store.load();
                                advancedSearchWindow.close();
                            }
                        }
                    },{
                        text: 'Close',
                        handler: function(){
                            advancedSearchWindow.close();
                        }
                    }]
                });
                advancedSearchWindow.show();
            }
        }        
        );

    config = Ext.apply({
      title:'Articles',
      columns:columnItems,
      store:store,
      tbar: tbarItems,
      bbar: new Ext.PagingToolbar({
        store: store,
        displayInfo: true,
        displayMsg: '{0} - {1} of {2}',
        emptyMsg: "Empty"
      }),
      autoScroll:true,
      viewConfig:{
        loadMask: false
      }
    }, config);

    this.callParent([config]);
  }
});
