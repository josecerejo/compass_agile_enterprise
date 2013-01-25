Compass.ErpApp.Widgets.DynamicGrid = {
    addWidget:function () {
        Ext.create("Ext.window.Window", {
            title:'Add Dynamic Grid',
            plain:true,
            buttonAlign:'center',
            items:Ext.create("Ext.form.Panel", {
                labelWidth:100,
                frame:false,
                bodyStyle:'padding:5px 5px 0',
                defaults:{
                    width:325
                },
                items:[
                    {
                        xtype:'combo',
                        value:'',
                        loadingText:'Retrieving Dynamic Form Models ...',
                        store:Ext.create('Ext.data.Store', {
                            proxy:{
                                type:'ajax',
                                reader:{
                                    type:'json',
                                    root:'dynamic_form_model'
                                },
                                url:'/erp_forms/erp_app/desktop/dynamic_forms/models/index'
                            },
                            fields:[
                                {
                                    name:'id'
                                },
                                {
                                    name:'model_name'
                                }
                            ]
                        }),
                        forceSelection:true,
                        editable:true,
                        fieldLabel:'Model Name',
                        autoSelect:true,
                        mode:'remote',
                        name:'model_name',
                        displayField:'model_name',
                        valueField:'model_name',
                        triggerAction:'all',
                        allowBlank:false,
                        plugins:[new helpQtip("Dynamic Form Model Name (Class)")],
                        listeners:{
                            select:function(){
                                this.up('form').down('fieldset').enable();
                            }
                        }
                    },
                    {
                        xtype:'fieldset',
                        title:'Grid Options',
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
                            var tpl = new Ext.XTemplate("<%= render_widget :dynamic_grid, :params => {:model_name => '{model_name}',\n",
                                    "   :grid => {\n",
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

                            content = tpl.apply(values);

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
    name:'Dynamic Grid',
    iconUrl:'/images/icons/grid/grid_48x48.png',
    onClick:Compass.ErpApp.Widgets.DynamicGrid.addWidget,
    about:'Add grid for dynamic model'
});