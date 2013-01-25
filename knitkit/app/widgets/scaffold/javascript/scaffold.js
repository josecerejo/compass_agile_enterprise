Compass.ErpApp.Widgets.Scaffold = {
    addScaffoldWidget:function () {
        var sm = Ext.create('Ext.selection.CheckboxModel');

        Ext.create("Ext.window.Window", {
            layout:'fit',
            title:'Add Scaffold',
            autoScroll:true,
            plain:true,
            buttonAlign:'center',
            items:Ext.create("Ext.form.Panel", {
                autoScroll:true,
                width:420,
                height:500,
                frame:false,
                bodyStyle:'padding:5px 5px 0',
                items:[
                    {
                        xtype:'combo',
                        forceSelection:true,
                        store:{
                            model:'ScaffoldModelName',
                            proxy:{
                                url:'/erp_app/desktop/scaffold/get_models',
                                type:'ajax',
                                reader:{
                                    type:'json',
                                    root:'names'
                                },
                                fields:[
                                    {name:'name', type:'string'}
                                ]
                            }
                        },
                        displayField:'name',
                        valueField:'name',
                        labelWidth:125,
                        fieldLabel:'CompassAE Model',
                        value:':Party',
                        name:'model',
                        allowBlank:false,
                        triggerAction:'all',
                        listeners:{
                            select:function (combo, records) {
                                var form = combo.up('form'), grid = form.down('grid');
                                grid.getStore().load({params:{model:records[0].get('name')}});
                                grid.enable();
                                form.down('#scaffoldOptions').enable();
                                form.down('#gridOptions').enable();
                            }
                        }
                    },
                    {
                        xtype:'fieldset',
                        style:'padding:5px',
                        title:'Columns',
                        items:[
                            {
                                xtype:'grid',
                                selModel:sm,
                                loadMask:true,
                                disabled:true,
                                autoScroll:true,
                                columns:[
                                    {text:"Column Name", width:200, dataIndex:'name'},
                                    {
                                        xtype:'checkcolumn',
                                        header:'Required?',
                                        dataIndex:'required',
                                        width:70,
                                        stopSelection:true
                                    },
                                    {
                                        xtype:'checkcolumn',
                                        header:'Readonly?',
                                        dataIndex:'readonly',
                                        width:70,
                                        stopSelection:true
                                    }
                                ],
                                store:{
                                    model:'ScaffoldColumn',
                                    proxy:{
                                        url:'/erp_app/desktop/scaffold/get_columns',
                                        type:'ajax',
                                        reader:{
                                            type:'json',
                                            root:'columns'
                                        }
                                    },
                                    fields:[
                                        {name:'name', type:'string'},
                                        {name:'readonly', type:'boolean', default:false},
                                        {name:'required', type:'boolean', default:false}
                                    ]
                                },
                                columnLines:true,
                                height:150,
                                frame:true
                            }
                        ]
                    },
                    {
                        xtype:'fieldset',
                        title:'Scaffold Options',
                        itemId:'scaffoldOptions',
                        disabled:true,
                        defaults:{
                            xtype:'fieldcontainer',
                            defaultType:'radiofield',
                            width:200,
                            defaults:{
                                flex:1
                            },
                            layout:'hbox'
                        },
                        items:[
                            {
                                fieldLabel:'Ignore Associations',
                                items:[
                                    {
                                        boxLabel:'Yes',
                                        name:'ignoreAssociations',
                                        checked:true,
                                        inputValue:'y'
                                    },
                                    {
                                        boxLabel:'No',
                                        name:'ignoreAssociations',
                                        inputValue:'n'
                                    }
                                ]
                            },
                            {
                                fieldLabel:'Show ID',
                                items:[
                                    {
                                        boxLabel:'Yes',
                                        name:'showId',
                                        checked:true,
                                        inputValue:'y'
                                    },
                                    {
                                        boxLabel:'No',
                                        name:'showId',
                                        inputValue:'n'
                                    }
                                ]
                            },
                            {
                                fieldLabel:'Show Timestamps',
                                items:[
                                    {
                                        boxLabel:'Yes',
                                        name:'showTimestamps',
                                        checked:true,
                                        inputValue:'y'
                                    },
                                    {
                                        boxLabel:'No',
                                        name:'showTimestamps',
                                        inputValue:'n'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype:'fieldset',
                        title:'Grid Options',
                        itemId:'gridOptions',
                        disabled:true,
                        items:[
                            {
                                xtype:'textfield',
                                name:'title',
                                fieldLabel:'Title'
                            },
                            {
                                xtype:'textfield',
                                name:'width',
                                value:500,
                                fieldLabel:'Width'
                            },
                            {
                                xtype:'textfield',
                                name:'height',
                                value:500,
                                fieldLabel:'Height'
                            },
                            {
                                xtype:'fieldcontainer',
                                defaultType:'radiofield',
                                width:200,
                                defaults:{
                                    flex:1
                                },
                                layout:'hbox',
                                fieldLabel:'Page Results',
                                toolTip:'Page results.',
                                items:[
                                    {
                                        boxLabel:'Yes',
                                        name:'page_results',
                                        checked:true,
                                        inputValue:'y'
                                    },
                                    {
                                        boxLabel:'No',
                                        name:'page_results',
                                        inputValue:'n'
                                    }
                                ]
                            },
                            {
                                xtype:'textfield',
                                name:'pageSize',
                                value:20,
                                fieldLabel:'Rows per Page'
                            },
                            {
                                xtype:'textfield',
                                name:'displayMsg',
                                value:'Displaying {0} - {1} of {2}',
                                fieldLabel:'Paging Display Message'
                            },
                            {
                                xtype:'textfield',
                                name:'emptyMsg',
                                value:'Empty',
                                fieldLabel:'Empty Message'
                            },
                            {
                                xtype:'fieldcontainer',
                                defaultType:'radiofield',
                                width:200,
                                defaults:{
                                    flex:1
                                },
                                layout:'hbox',
                                fieldLabel:'Allow Edits',
                                toolTip:'Allow users to edit data.',
                                items:[
                                    {
                                        boxLabel:'Yes',
                                        name:'editiable',
                                        checked:true,
                                        inputValue:'y'
                                    },
                                    {
                                        boxLabel:'No',
                                        name:'editiable',
                                        inputValue:'n'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }),
            buttons:[
                {
                    text:'Submit',
                    listeners:{
                        'click':function (button) {
                            var tpl = new Ext.XTemplate("<%= render_widget :scaffold, :params => {:model => '{model}',\n",
                                    "   :scaffold => {\n",
                                    "       :ignore_associations => {ignoreAssociations:this.toBoolean},\n",
                                    "       :show_id => {showId:this.toBoolean},\n",
                                    "       :show_timestamps => {showTimestamps:this.toBoolean},\n",
                                    "       :only => [\n",
                                    '<tpl for="columns">',
                                    "           {:{name} => {:required => {required:this.toBoolean}, :readonly => {readonly:this.toBoolean}}},\n",
                                    '</tpl>',
                                    "       ]\n",
                                    "   },\n",
                                    "   :grid => {\n",
                                    "       :editable => {editiable:this.toBoolean},\n",
                                    "       :title => '{title}',\n",
                                    "       :width => {width},\n",
                                    "       :height => {height},\n",
                                    "       :page => {page_results:this.toBoolean},\n",
                                    "       :page_size => {pageSize},\n",
                                    "       :display_msg => '{displayMsg}',\n",
                                    "       :empty_msg => '{emptyMsg}'\n",
                                    "   }\n",
                                    "} %>",
                                    {
                                        toBoolean:function (value) {
                                            var result = 'false';
                                            if (value == 'y') {
                                                result = 'true';
                                            }
                                            return result;
                                        }
                                    }),
                                content = null,
                                window = button.findParentByType('window'),
                                formPanel = window.query('form')[0],
                                grid = formPanel.down('grid'),
                                basicForm = formPanel.getForm(),
                                values = basicForm.getValues();

                            var data = values;
                            data['columns'] = [];

                            var columns = Ext.each(grid.getSelectionModel().getSelection(), function (record) {
                                data['columns'].push({
                                    name:record.get('name'),
                                    readonly:record.get('readonly'),
                                    required:record.get('required')
                                });
                            });

                            content = tpl.apply(data);

                            //add rendered template to center region editor
                            Ext.getCmp('knitkitCenterRegion').addContentToActiveCodeMirror(content);
                            button.up('window').close();
                        }
                    }
                },
                {
                    text:'Close',
                    handler:function (btn) {
                        btn.up('window').close();
                    }
                }
            ]
        }).show();
    }
}

Compass.ErpApp.Widgets.AvailableWidgets.push({
    name:'CompassAE Scaffold',
    iconUrl:'/images/icons/grid/grid_48x48.png',
    onClick:Compass.ErpApp.Widgets.Scaffold.addScaffoldWidget,
    about:'Scaffold a CompassAE model'
});