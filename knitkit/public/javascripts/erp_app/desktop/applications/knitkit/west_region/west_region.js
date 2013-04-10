Ext.define("Compass.ErpApp.Desktop.Applications.Knitkit.WestRegion", {
    extend:"Ext.tab.Panel",
    id:'knitkitWestRegion',
    alias:'widget.knitkit_westregion',
    setWindowStatus:function (status) {
        this.findParentByType('statuswindow').setStatus(status);
    },

    clearWindowStatus:function () {
        this.findParentByType('statuswindow').clearStatus();
    },

    deleteSection:function (node) {
        var self = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this section?<br> NOTE: Articles belonging to this section will be orphaned.', function (btn) {
            if (btn == 'no') {
                return false;
            }
            else if (btn == 'yes') {
                self.setWindowStatus('Deleting Section...');
                Ext.Ajax.request({
                    url:'/knitkit/erp_app/desktop/section/delete',
                    method:'POST',
                    params:{
                        id:node.data.id.split('_')[1]
                    },
                    success:function (response) {
                        self.clearWindowStatus();
                        var obj = Ext.decode(response.responseText);
                        if (obj.success) {
                            node.remove(true);
                        }
                        else {
                            Ext.Msg.alert('Error', 'Error deleting section');
                        }
                    },
                    failure:function (response) {
                        self.clearWindowStatus();
                        Ext.Msg.alert('Error', 'Error deleting section');
                    }
                });
            }
        });
    },

    exportSite:function (id) {
        var self = this;
        self.setWindowStatus('Exporting Website...');
        window.open('/knitkit/erp_app/desktop/site/export?id=' + id, 'mywindow', 'width=400,height=200');
        self.clearWindowStatus();
    },

    deleteSite:function (node) {
        var self = this;
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Website?', function (btn) {
            if (btn == 'no') {
                return false;
            }
            else if (btn == 'yes') {
                self.setWindowStatus('Deleting Website...');
                Ext.Ajax.request({
                    url:'/knitkit/erp_app/desktop/site/delete',
                    method:'POST',
                    params:{
                        id:node.data.id.split('_')[1]
                    },
                    success:function (response) {
                        self.clearWindowStatus();
                        var obj = Ext.decode(response.responseText);
                        if (obj.success) {
                            node.removeAll();
							node.remove();
                        }
                        else {
                            Ext.Msg.alert('Error', 'Error deleting Website');
                        }
                    },
                    failure:function (response) {
                        self.clearWindowStatus();
                        Ext.Msg.alert('Error', 'Error deleting Website');
                    }
                });
            }
        });
    },

    publish:function (node) {
        var self = this;
        var publishWindow = Ext.create('Compass.ErpApp.Desktop.Applications.Knitkit.PublishWindow',{
            baseParams:{
                id:node.id.split('_')[1]
            },
            url:'/knitkit/erp_app/desktop/site/publish',
            listeners:{
                'publish_success':function (window, response) {
                    if (response.success) {
                        self.getPublications(node);
                    }
                    else {
                        Ext.Msg.alert('Error', 'Error publishing Website');
                    }
                },
                'publish_failure':function (window, response) {
                    Ext.Msg.alert('Error', 'Error publishing Website');
                }
            }
        });

        publishWindow.show();
    },

    editSectionLayout:function (sectionName, sectionId, websiteId) {
        var self = this;
        self.selectWebsite(websiteId);
        self.setWindowStatus('Loading section template...');
        Ext.Ajax.request({
            url:'/knitkit/erp_app/desktop/section/get_layout',
            method:'POST',
            params:{
                id:sectionId
            },
            success:function (response) {
                self.initialConfig['centerRegion'].editSectionLayout(
                    sectionName,
                    websiteId,
                    sectionId,
                    response.responseText,
                    [
                        {
                            text:'Insert Content Area',
                            handler:function (btn) {
                                var codeMirror = btn.findParentByType('codemirror');
                                Ext.MessageBox.prompt('New File', 'Please enter content area name:', function (btn, text) {
                                    if (btn == 'ok') {
                                        codeMirror.insertContent('<%=render_content_area(:' + text + ')%>');
                                    }

                                });
                            }
                        }
                    ]);
                self.clearWindowStatus();
            },
            failure:function (response) {
                self.clearWindowStatus();
                Ext.Msg.alert('Error', 'Error loading section layout.');
            }
        });
    },

    changeSecurity:function (node, updateUrl, id) {
        Ext.Ajax.request({
            url:'/knitkit/erp_app/desktop/available_roles',
            method:'POST',
            success:function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.create('widget.knikit_selectroleswindow',{
                        baseParams:{
                            id:id,
                            site_id:node.get('siteId')
                        },
                        url: updateUrl,
                        currentRoles:node.get('roles'),
                        availableRoles:obj.availableRoles,
                        listeners:{
                            success:function(window, response){
                                node.set('roles', response.roles);
                                if (response.secured) {
                                    node.set('iconCls', 'icon-document_lock');
                                }
                                else {
                                    node.set('iconCls', 'icon-document');
                                }
                                node.set('isSecured', response.secured);
                                node.commit();
                            },
                            failure:function(){
                                Ext.Msg.alert('Error', 'Could not update security');
                            }
                        }
                    }).show();
                }
                else {
                    Ext.Msg.alert('Error', 'Could not load available roles');
                }
            },
            failure:function (response) {
                Ext.Msg.alert('Error', 'Could not load available roles');
            }
        });
    },

    selectWebsite:function (websiteId) {
        var node = this.sitesTree.getStore().getNodeById("website_" + websiteId);
        if (node.data.iconCls != 'icon-globe') {
            node.set('iconCls', 'icon-globe');
            node.commit();
        }
        node.parentNode.eachChild(function (child) {
            if (node.data.id != child.data.id) {
                if (child.data.iconCls != 'icon-globe_disconnected') {
                    child.set('iconCls', 'icon-globe_disconnected');
                    child.commit();
                }
            }
        });
        var eastRegion = Ext.ComponentQuery.query('#knitkitEastRegion').first();
        eastRegion.fileAssetsPanel.selectWebsite(websiteId, node.data.text);
        eastRegion.imageAssetsPanel.selectWebsite(websiteId, node.data.text);

        Compass.ErpApp.Shared.FileManagerTree.extraPostData = {
            website_id:websiteId
        };
    },

    updateWebsiteConfiguration:function (rec) {
        var configurationWindow = Ext.create("Ext.window.Window", {
            layout:'fit',
            width:600,
            title:'Configuration',
            height:400,
            autoScroll:true,
            plain:true,
            items:[
                {
                    xtype:'sharedconfigurationpanel',
                    configurationId:rec.get('configurationId')
                }
            ]
        });

        configurationWindow.show();
    },

    initComponent:function () {
        var self = this;

        var store = Ext.create('Ext.data.TreeStore', {
            proxy:{
                type:'ajax',
                url:'/knitkit/erp_app/desktop/websites',
                timeout:90000
            },
            root:{
                text:'Websites',
                expanded:true
            },
            fields:[
                {
                    name:'text'
                },
                {
                    name:'iconCls'
                },
                {
                    name:'leaf'
                },
                {
                    name:'canAddMenuItems'
                },
                {
                    name:'isWebsiteNavItem'
                },
                {
                    name:'isSection'
                },
                {
                    name:'isDocument'
                },
                {
                    name:'contentInfo'
                },
                {
                    name:'isHost'
                },
                {
                    name:'isSecured'
                },
                {
                    name:'url'
                },
                {
                    name:'path'
                },
                {
                    name:'inMenu'
                },
                {
                    name:'isBlog'
                },
                {
                    name:'hasLayout'
                },
                {
                    name:'siteId'
                },
                {
                    name:'type'
                },
                {
                    name:'isWebsite'
                },
                {
                    name:'name'
                },
                {
                    name:'title'
                },
                {
                    name:'subtitle'
                },
                {
                    name:'isHostRoot'
                },
                {
                    name:'websiteHostId'
                },
                {
                    name:'host'
                },
                {
                    name:'websiteId'
                },
                {
                    name:'isSectionRoot'
                },
                {
                    name:'isWebsiteNav'
                },
                {
                    name:'isMenuRoot'
                },
                {
                    name:'linkToType'
                },
                {
                    name:'linkedToId'
                },
                {
                    name:'websiteNavItemId'
                },
                {
                    name:'siteName'
                },
                {
                    name:'websiteNavId'
                },
                {
                    name:'internal_identifier'
                },
                {
                    name:'configurationId'
                },
                {
                    name:'renderWithBaseLayout'
                },
                {
                    name:'publication_comments_enabled'
                },
                {
                    name:'roles'
                },
                {
                    name:'useMarkdown'
                }
            ],
            listeners:{
                'load':function(store, node, records){
                  if(records.length > 0){
					var websiteId = records[0].id.split('_')[1];
                  		westRegion = Ext.ComponentQuery.query('#knitkitWestRegion').first();
                  	westRegion.selectWebsite(websiteId);
				  }	
                }
            }
        });

        var pluginItems = [];

        if (currentUser.hasCapability('drag_item','WebsiteTree')) {
            pluginItems.push({
                ptype:'treeviewdragdrop'
            });
        }

        var viewConfigItems = {
            markDirty:false,
            plugins:pluginItems,
            listeners:{
                'beforedrop':function (node, data, overModel, dropPosition, dropFunction, options) {
                    if (overModel.data['isWebsiteNavItem']) {
                        return true;
                    }
                    else if (overModel.data['isSection']) {
                        if (overModel.parentNode.data['isSectionRoot']) {
                            return true;
                        }
                    }
                    else if (overModel.data['isDocument']) {
                        return true;
                    }
                    return false;
                },
                'drop':function (node, data, overModel, dropPosition, options) {
                    var positionArray = [];
                    var counter = 0;
                    var dropNode = data.records[0];

                    if (dropNode.data['isWebsiteNavItem']) {
                        overModel.parentNode.eachChild(function (node) {
                            positionArray.push({
                                id:node.data.websiteNavItemId,
                                position:counter,
                                klass:'WebsiteNavItem'
                            });
                            counter++;
                        });
                    }
                    else {
                        overModel.parentNode.eachChild(function (node) {
                            positionArray.push({
                                id:node.data.id.split('_')[1],
                                position:counter,
                                klass:'WebsiteSection'
                            });
                            counter++;
                        });
                    }

                    Ext.Ajax.request({
                        url:'/knitkit/erp_app/desktop/position/update',
                        method:'PUT',
                        jsonData:{
                            position_array:positionArray
                        },
                        success:function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {

                            }
                            else {
                                Ext.Msg.alert("Error", obj.message);
                            }
                        },
                        failure:function (response) {
                            Ext.Msg.alert('Error', 'Error saving positions.');
                        }
                    });
                }
            }
        };

        this.sitesTree = Ext.create('Ext.tree.TreePanel',{
            viewConfig:viewConfigItems,
            store:store,
            region:'center',
            rootVisible:false,
            enableDD:true,
            listeners:{
                'itemclick':function (view, record, htmlItem, index, e) {
                    e.stopEvent();
                    if (record.data['isWebsite']) {
                        self.selectWebsite(record.data.id.split('_')[1]);
                    }
                    else if (record.data['isSection']) {
                        self.getArticles(record);
                    }
                    else if (record.data['isHost']) {
                        var webNavigator = window.compassDesktop.getModule('web-navigator-win');
                        webNavigator.createWindow(record.data['url']);
                    }
                    else if (record.data['isDocument']) {
                        var contentInfo = record.data['contentInfo'];
                        if(record.data['useMarkdown']){
                            self.initialConfig['centerRegion'].editDocumentationMarkdown(
                                contentInfo.title,
                                record.data['siteId'],
                                contentInfo.id,
                                contentInfo.body_html,
                                []
                            );
                        }
                        else{
                            self.initialConfig['centerRegion'].editContent(
                                record.data['contentInfo'].title,
                                record.data['contentInfo'].id,
                                record.data['contentInfo'].body_html,
                                record.data['siteId'],
                                'article'
                            );
                        }

                    }
                },
                'itemcontextmenu':function (view, record, htmlItem, index, e) {
                    e.stopEvent();
                    var items = [];

                    if (!Compass.ErpApp.Utility.isBlank(record.data['url'])) {
                        items.push({
                            text:'View In Web Navigator',
                            iconCls:'icon-globe',
                            listeners:{
                                'click':function () {
                                    var webNavigator = window.compassDesktop.getModule('web-navigator-win');
                                    webNavigator.createWindow(record.data['url']);
                                }
                            }
                        });
                    }

                    items = Compass.ErpApp.Desktop.Applications.Knitkit.addMenuOptions(self, items, record);

                    if (record.data['isDocument']) {
                        items = Compass.ErpApp.Desktop.Applications.Knitkit.addDocumentOptions(self, items, record);
                    }

                    if (record.data['isSection']) {
                        items = Compass.ErpApp.Desktop.Applications.Knitkit.addSectionOptions(self, items, record);
                    }
                    else if (record.data['isWebsite']) {
                        items = Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteOptions(self, items, record);
                    }
                    else if (record.data['isHostRoot']) {
                        if (currentUser.hasCapability('create','WebsiteHost')) {
                            items.push({
                                text:'Add Host',
                                iconCls:'icon-add',
                                listeners:{
                                    'click':function () {
                                        var addHostWindow = Ext.create("Ext.window.Window", {
                                            layout:'fit',
                                            width:310,
                                            title:'Add Host',
                                            height:100,
                                            plain:true,
                                            buttonAlign:'center',
                                            items:Ext.create("Ext.form.Panel", {
                                                labelWidth:50,
                                                frame:false,
                                                bodyStyle:'padding:5px 5px 0',
                                                width:425,
                                                url:'/knitkit/erp_app/desktop/site/add_host',
                                                defaults:{
                                                    width:225
                                                },
                                                items:[
                                                    {
                                                        xtype:'textfield',
                                                        fieldLabel:'Host',
                                                        name:'host',
                                                        allowBlank:false
                                                    },
                                                    {
                                                        xtype:'hidden',
                                                        name:'id',
                                                        value:record.data.websiteId
                                                    }
                                                ]
                                            }),
                                            buttons:[
                                                {
                                                    text:'Submit',
                                                    listeners:{
                                                        'click':function (button) {
                                                            var window = button.findParentByType('window');
                                                            var formPanel = window.query('form')[0];
                                                            self.setWindowStatus('Adding Host...');
                                                            formPanel.getForm().submit({
                                                                reset:true,
                                                                success:function (form, action) {
                                                                    self.clearWindowStatus();
                                                                    var obj = Ext.decode(action.response.responseText);
                                                                    if (obj.success) {
                                                                        addHostWindow.close();
                                                                        record.appendChild(obj.node);
                                                                    }
                                                                    else {
                                                                        Ext.Msg.alert("Error", obj.msg);
                                                                    }
                                                                },
                                                                failure:function (form, action) {
                                                                    self.clearWindowStatus();
                                                                    Ext.Msg.alert("Error", "Error adding Host");
                                                                }
                                                            });
                                                        }
                                                    }
                                                },
                                                {
                                                    text:'Close',
                                                    handler:function () {
                                                        addHostWindow.close();
                                                    }
                                                }
                                            ]
                                        });
                                        addHostWindow.show();
                                    }
                                }
                            });
                        }
                    }
                    else if (record.data['isHost']) {
                        items = Compass.ErpApp.Desktop.Applications.Knitkit.addHostOptions(self, items, record);
                    }
                    else if (record.data['isSectionRoot']) {
                        if (currentUser.hasCapability('create','WebsiteSection')) {
                            items.push({
                                text:'Add Section',
                                iconCls:'icon-add',
                                listeners:{
                                    'click':function () {
                                        var addSectionWindow = Ext.create("Ext.window.Window", {
                                            layout:'fit',
                                            width:375,
                                            title:'New Section',
                                            plain:true,
                                            buttonAlign:'center',
                                            items:Ext.create("Ext.form.Panel", {
                                                labelWidth:110,
                                                frame:false,
                                                bodyStyle:'padding:5px 5px 0',
                                                url:'/knitkit/erp_app/desktop/section/new',
                                                defaults:{
                                                    width:225
                                                },
                                                items:[
                                                    {
                                                        xtype:'textfield',
                                                        fieldLabel:'Title',
                                                        allowBlank:false,
                                                        name:'title'
                                                    },
                                                    {
                                                        xtype:'textfield',
                                                        fieldLabel:'Internal ID',
                                                        allowBlank:true,
                                                        name:'internal_identifier'
                                                    },
                                                    {
                                                        xtype:'combo',
                                                        forceSelection:true,
                                                        store:[
                                                            ['Page', 'Page'],
                                                            ['Blog', 'Blog'],
                                                            ['OnlineDocumentSection', 'Online Document Section']
                                                        ],
                                                        value:'Page',
                                                        fieldLabel:'Type',
                                                        name:'type',
                                                        allowBlank:false,
                                                        triggerAction:'all'
                                                    },
                                                    {
                                                        xtype:'radiogroup',
                                                        fieldLabel:'Display in menu?',
                                                        name:'in_menu',
                                                        columns:2,
                                                        items:[
                                                            {
                                                                boxLabel:'Yes',
                                                                name:'in_menu',
                                                                inputValue:'yes',
                                                                checked:true
                                                            },

                                                            {
                                                                boxLabel:'No',
                                                                name:'in_menu',
                                                                inputValue:'no'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        xtype:'radiogroup',
                                                        fieldLabel:'Render with Base Layout?',
                                                        name:'render_with_base_layout',
                                                        columns:2,
                                                        items:[
                                                            {
                                                                boxLabel:'Yes',
                                                                name:'render_with_base_layout',
                                                                inputValue:'yes',
                                                                checked:true
                                                            },

                                                            {
                                                                boxLabel:'No',
                                                                name:'render_with_base_layout',
                                                                inputValue:'no'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        xtype:'hidden',
                                                        name:'website_id',
                                                        value:record.data.websiteId
                                                    }
                                                ]
                                            }),
                                            buttons:[
                                                {
                                                    text:'Submit',
                                                    listeners:{
                                                        'click':function (button) {
                                                            var window = button.findParentByType('window');
                                                            var formPanel = window.query('form')[0];
                                                            self.setWindowStatus('Creating section...');
                                                            formPanel.getForm().submit({
                                                                reset:true,
                                                                success:function (form, action) {
                                                                    self.clearWindowStatus();
                                                                    var obj = Ext.decode(action.response.responseText);
                                                                    if (obj.success) {
                                                                        record.appendChild(obj.node);
                                                                        addSectionWindow.close();
                                                                    }
                                                                    else {
                                                                        Ext.Msg.alert("Error", obj.msg);
                                                                    }
                                                                },
                                                                failure:function (form, action) {
                                                                    self.clearWindowStatus();
                                                                    var obj = Ext.decode(action.response.responseText);
                                                                    if (obj.message) {
                                                                        Ext.Msg.alert("Error", obj.message);
                                                                    }
                                                                    else {
                                                                        Ext.Msg.alert("Error", "Error creating section.");
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                },
                                                {
                                                    text:'Close',
                                                    handler:function () {
                                                        addSectionWindow.close();
                                                    }
                                                }
                                            ]
                                        });
                                        addSectionWindow.show();
                                    }
                                }
                            });
                        }
                    }
                    else if (record.data['isMenuRoot']) {
                        if (currentUser.hasCapability('create','WebsiteNav')) {
                            items.push({
                                text:'Add Menu',
                                iconCls:'icon-add',
                                handler:function (btn) {
                                    var addMenuWindow = Ext.create("Ext.window.Window", {
                                        layout:'fit',
                                        width:375,
                                        title:'New Menu',
                                        height:100,
                                        plain:true,
                                        buttonAlign:'center',
                                        items:Ext.create("Ext.form.Panel", {
                                            labelWidth:50,
                                            frame:false,
                                            bodyStyle:'padding:5px 5px 0',
                                            url:'/knitkit/erp_app/desktop/website_nav/new',
                                            defaults:{
                                                width:225
                                            },
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'name',
                                                    allowBlank:false,
                                                    name:'name'
                                                },
                                                {
                                                    xtype:'hidden',
                                                    name:'website_id',
                                                    value:record.data.websiteId
                                                }
                                            ]
                                        }),
                                        buttons:[
                                            {
                                                text:'Submit',
                                                listeners:{
                                                    'click':function (button) {
                                                        var window = button.findParentByType('window');
                                                        var formPanel = window.query('form')[0];
                                                        self.setWindowStatus('Creating menu...');
                                                        formPanel.getForm().submit({
                                                            reset:true,
                                                            success:function (form, action) {
                                                                self.clearWindowStatus();
                                                                var obj = Ext.decode(action.response.responseText);
                                                                if (obj.success) {
                                                                    record.appendChild(obj.node);
                                                                }
                                                                else {
                                                                    Ext.Msg.alert("Error", obj.msg);
                                                                }
                                                            },
                                                            failure:function (form, action) {
                                                                self.clearWindowStatus();
                                                                var obj = Ext.decode(action.response.responseText);
                                                                Ext.Msg.alert("Error", obj.msg);
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                text:'Close',
                                                handler:function () {
                                                    addMenuWindow.close();
                                                }
                                            }
                                        ]
                                    });
                                    addMenuWindow.show();
                                }
                            });
                        }
                    }
                    else if (record.data['isWebsiteNav']) {
                        if (currentUser.hasCapability('edit','WebsiteNav')) {
                            items.push({
                                text:'Update',
                                iconCls:'icon-edit',
                                handler:function (btn) {
                                    var updateMenuWindow = Ext.create("Ext.window.Window", {
                                        layout:'fit',
                                        width:375,
                                        title:'Update Menu',
                                        height:100,
                                        plain:true,
                                        buttonAlign:'center',
                                        items:new Ext.FormPanel({
                                            labelWidth:50,
                                            frame:false,
                                            bodyStyle:'padding:5px 5px 0',
                                            url:'/knitkit/erp_app/desktop/website_nav/update',
                                            defaults:{
                                                width:225
                                            },
                                            items:[
                                                {
                                                    xtype:'textfield',
                                                    fieldLabel:'Name',
                                                    value:record.data.text,
                                                    id:'knitkit_website_nav_update_name',
                                                    allowBlank:false,
                                                    name:'name'
                                                },
                                                {
                                                    xtype:'hidden',
                                                    name:'website_nav_id',
                                                    value:record.data.websiteNavId
                                                }
                                            ]
                                        }),
                                        buttons:[
                                            {
                                                text:'Submit',
                                                listeners:{
                                                    'click':function (button) {
                                                        var window = button.findParentByType('window');
                                                        var formPanel = window.query('form')[0];
                                                        self.setWindowStatus('Creating menu...');
                                                        formPanel.getForm().submit({
                                                            reset:false,
                                                            success:function (form, action) {
                                                                self.clearWindowStatus();
                                                                var obj = Ext.decode(action.response.responseText);
                                                                if (obj.success) {
                                                                    var newText = Ext.getCmp('knitkit_website_nav_update_name').getValue();
                                                                    record.set('text', newText);
                                                                    record.commit();
                                                                }
                                                                else {
                                                                    Ext.Msg.alert("Error", obj.msg);
                                                                }
                                                            },
                                                            failure:function (form, action) {
                                                                self.clearWindowStatus();
                                                                var obj = Ext.decode(action.response.responseText);
                                                                Ext.Msg.alert("Error", obj.msg);
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                text:'Close',
                                                handler:function () {
                                                    updateMenuWindow.close();
                                                }
                                            }
                                        ]
                                    });
                                    updateMenuWindow.show();
                                }
                            });
                        }

                        if (currentUser.hasCapability('delete','WebsiteNav')) {
                            items.push({
                                text:'Delete',
                                iconCls:'icon-delete',
                                handler:function (btn) {
                                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this menu?', function (btn) {
                                        if (btn == 'no') {
                                            return false;
                                        }
                                        else if (btn == 'yes') {
                                            self.setWindowStatus('Deleting menu...');
                                            Ext.Ajax.request({
                                                url:'/knitkit/erp_app/desktop/website_nav/delete',
                                                method:'POST',
                                                params:{
                                                    id:record.data.websiteNavId
                                                },
                                                success:function (response) {
                                                    self.clearWindowStatus();
                                                    var obj = Ext.decode(response.responseText);
                                                    if (obj.success) {
                                                        record.remove(true);
                                                    }
                                                    else {
                                                        Ext.Msg.alert('Error', 'Error deleting menu');
                                                    }
                                                },
                                                failure:function (response) {
                                                    self.clearWindowStatus();
                                                    Ext.Msg.alert('Error', 'Error deleting menu');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else if (record.data['isWebsiteNavItem']) {
                        items = Compass.ErpApp.Desktop.Applications.Knitkit.addWebsiteNavItemOptions(self, items, record);
                    }
                    if (items.length != 0) {
                        var contextMenu = Ext.create("Ext.menu.Menu", {
                            items:items
                        });
                        contextMenu.showAt(e.xy);
                    }
                }
            }
        });

        this.contentsCardPanel = Ext.create('Ext.Panel',{
            layout:'card',
            region:'south',
            split:true,
            height:300,
            collapsible:true
        });

        var tbarItems = [];

        if (currentUser.hasCapability('create','Website')) {
            tbarItems.push({
                    text:'New Website',
                    iconCls:'icon-add',
                    handler:function (btn) {
                        var addWebsiteWindow = Ext.create("Ext.window.Window", {
                            title:'New Website',
                            plain:true,
                            buttonAlign:'center',
                            items:new Ext.FormPanel({
                                labelWidth:110,
                                frame:false,
                                bodyStyle:'padding:5px 5px 0',
                                url:'/knitkit/erp_app/desktop/site/new',
                                defaults:{
                                    width:225
                                },
                                items:[
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Name',
                                        allowBlank:false,
                                        name:'name'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Host',
                                        allowBlank:false,
                                        name:'host'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Title',
                                        allowBlank:false,
                                        name:'title'
                                    },
                                    {
                                        xtype:'textfield',
                                        fieldLabel:'Sub Title',
                                        allowBlank:true,
                                        name:'subtitle'
                                    }
                                ]
                            }),
                            buttons:[
                                {
                                    text:'Submit',
                                    listeners:{
                                        'click':function (button) {
                                            var window = button.findParentByType('window');
                                            var formPanel = window.query('.form')[0];
                                            self.setWindowStatus('Creating website...');
                                            formPanel.getForm().submit({
                                                success:function (form, action) {
                                                    self.clearWindowStatus();
                                                    var obj = Ext.decode(action.response.responseText);
                                                    if (obj.success) {
                                                        self.sitesTree.getStore().load();
                                                        addWebsiteWindow.close();
                                                    }
                                                },
                                                failure:function (form, action) {
                                                    self.clearWindowStatus();
                                                    Ext.Msg.alert("Error", "Error creating website");
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    text:'Close',
                                    handler:function () {
                                        addWebsiteWindow.close();
                                    }
                                }
                            ]
                        });
                        addWebsiteWindow.show();
                    }
                }
            );
        }

        if (currentUser.hasCapability('import','Website')) {
            tbarItems.push({
                text:'Import Website',
                iconCls:'icon-globe',
                handler:function (btn) {
                    var importWebsiteWindow = Ext.create("Ext.window.Window", {
                        layout:'fit',
                        width:375,
                        title:'Import Website',
                        height:100,
                        plain:true,
                        buttonAlign:'center',
                        items:new Ext.FormPanel({
                            labelWidth:110,
                            frame:false,
                            fileUpload:true,
                            bodyStyle:'padding:5px 5px 0',
                            url:'/knitkit/erp_app/desktop/site/import',
                            defaults:{
                                width:225
                            },
                            items:[
                                {
                                    xtype:'fileuploadfield',
                                    fieldLabel:'Upload Website',
                                    buttonText:'Upload',
                                    buttonOnly:false,
                                    allowBlank:false,
                                    name:'website_data'
                                }
                            ]
                        }),
                        buttons:[
                            {
                                text:'Submit',
                                listeners:{
                                    'click':function (button) {
                                        var window = button.findParentByType('window');
                                        var formPanel = window.query('form')[0];
                                        self.setWindowStatus('Importing website...');
                                        formPanel.getForm().submit({
                                            success:function (form, action) {
                                                self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj.success) {
                                                    self.sitesTree.getStore().load();
                                                    importWebsiteWindow.close();
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                            },
                                            failure:function (form, action) {
                                                self.clearWindowStatus();
                                                var obj = Ext.decode(action.response.responseText);
                                                if (obj != null) {
                                                    Ext.Msg.alert("Error", obj.message);
                                                }
                                                else {
                                                    Ext.Msg.alert("Error", "Error importing website");
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text:'Close',
                                handler:function () {
                                    importWebsiteWindow.close();
                                }
                            }
                        ]
                    });
                    importWebsiteWindow.show();
                }
            });
        }

        var layout = Ext.create('Ext.panel.Panel',{
            layout:'border',
            title:'Websites',
            items:[this.sitesTree, this.contentsCardPanel],
            tbar:{
                items:tbarItems
            }
        });

        if (currentUser.hasCapability('view','Theme')) {
            this.items = [layout,
                {
                    xtype:'knitkit_themestreepanel',
                    centerRegion:this.initialConfig['module'].centerRegion
                },
                {
                    xtype:'knitkit_articlesgridpanel',
                    centerRegion:this.initialConfig['module'].centerRegion
                }];
        } else {
            this.items = [layout,
                {
                    xtype:'knitkit_articlesgridpanel',
                    centerRegion:this.initialConfig['module'].centerRegion
                }];
        }

        this.callParent(arguments);
        this.setActiveTab(0);
    },

    getArticles:function (node) {
        this.contentsCardPanel.removeAll(true);
        var xtype = 'knitkit_' + node.data.type.toLowerCase() + 'articlesgridpanel';
        this.contentsCardPanel.add({
            xtype:xtype,
            title:node.data.siteName + ' - ' + node.data.text + ' - Articles',
            sectionId:node.data.id.split('_')[1],
            centerRegion:this.initialConfig['module'].centerRegion,
            siteId:node.data.siteId
        });
        this.contentsCardPanel.getLayout().setActiveItem(this.contentsCardPanel.items.length - 1);
    },

    getPublications:function (node) {
        this.contentsCardPanel.removeAll(true);
        this.contentsCardPanel.add({
            xtype:'knitkit_publishedgridpanel',
            title:node.data.siteName + ' Publications',
            siteId:node.data.id.split('_')[1],
            centerRegion:this.initialConfig['module'].centerRegion
        });
        this.contentsCardPanel.getLayout().setActiveItem(this.contentsCardPanel.items.length - 1);
    },

    constructor:function (config) {
        config = Ext.apply({
            region:'west',
            split:true,
            width:350,
            collapsible:true
        }, config);

        this.callParent([config]);
    }
});
