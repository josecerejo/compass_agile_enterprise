Compass.ErpApp.Widgets.DynamicForms = {
    template: new Ext.XTemplate(
        "<% # Optional Parameters:\n",
        "   # internal_identifier: Models can have multiple forms\n",
        "   #                      Leave blank if you want to use the default form\n",
        "   #                      Specify internal_identifier to choose a specific form %>\n",
        "<%= render_widget :dynamic_forms,\n",
        "   :params => {:model_name => '{WidgetDynamicFormModelName}',\n",
        "               :internal_identifier => ''",
        '<tpl if="WidgetDynamicFormWidth">',
        ",\n               :width => {WidgetDynamicFormWidth} ",
        '</tpl>',
        "} %>"),

    addDynamicForm: function () {
        var addDynamicFormWidgetWindow = Ext.create("Ext.window.Window", {
            layout: 'fit',
            width: 375,
            title: 'Add DynamicForm Widget',
            plain: true,
            buttonAlign: 'center',
            items: Ext.create("Ext.form.Panel", {
                labelWidth: 100,
                frame: false,
                bodyStyle: 'padding:5px 5px 0',
                defaults: {
                    width: 325
                },
                items: [
                    {
                        xtype: 'combo',
                        value: '',
                        loadingText: 'Retrieving Dynamic Form Models ...',
                        store: Ext.create('Ext.data.Store', {
                            proxy: {
                                type: 'ajax',
                                reader: {
                                    type: 'json',
                                    root: 'dynamic_form_model'
                                },
                                url: '/erp_forms/erp_app/desktop/dynamic_forms/models/index'
                            },
                            fields: [
                                {
                                    name: 'id'
                                },
                                {
                                    name: 'model_name'
                                }
                            ]
                        }),
                        forceSelection: true,
                        editable: true,
                        fieldLabel: 'Model Name',
                        autoSelect: true,
                        mode: 'remote',
                        name: 'model_name',
                        displayField: 'model_name',
                        valueField: 'model_name',
                        triggerAction: 'all',
                        allowBlank: false,
                        plugins: [new helpQtip("Dynamic Form Model Name (Class)")]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Form Width',
                        name: 'form_width',
                        allowBlank: true,
                        plugins: [new helpQtip("Form Width in Pixels. Leave blank for auto width.")]
                    }
                ]
            }),
            buttons: [
                {
                    text: 'Submit',
                    listeners: {
                        'click': function (button) {
                            var formPanel = button.findParentByType('window').query('form').first(),
                                basicForm = formPanel.getForm(),
                                WidgetDynamicFormModelName = basicForm.findField('model_name'),
                                WidgetDynamicFormWidth = basicForm.findField('form_width');
                            if (basicForm.isValid()) {
                                var data = {
                                    WidgetDynamicFormModelName: WidgetDynamicFormModelName.getValue(),
                                    WidgetDynamicFormWidth: WidgetDynamicFormWidth.getValue()
                                };

                                //add rendered template to center region editor
                                Ext.getCmp('knitkitCenterRegion').addContentToActiveCodeMirror(Compass.ErpApp.Widgets.DynamicForms.template.apply(data));
                                addDynamicFormWidgetWindow.close();
                            }
                        }
                    }
                },
                {
                    text: 'Close',
                    handler: function () {
                        addDynamicFormWidgetWindow.close();
                    }
                }
            ]
        }).show();
    }
};

Compass.ErpApp.Widgets.AvailableWidgets.push({
    name: 'Dynamic Forms',
    iconUrl: '/images/icons/document_text/document_text_48x48.png',
    onClick: Compass.ErpApp.Widgets.DynamicForms.addDynamicForm
});
