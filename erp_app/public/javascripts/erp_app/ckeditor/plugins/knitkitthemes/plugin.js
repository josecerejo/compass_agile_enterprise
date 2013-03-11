(function () {
    //Section 1 : Code to execute when the toolbar button is pressed
    var a = {
            exec: function (editor) {
                Ext.Ajax.request({
                    url: '/knitkit/erp_app/desktop/theme/get_ckeditor_selectable_themes',
                    type: 'post',
                    success: function (response) {
                        var responseObj = Ext.JSON.decode(response.responseText);
                        if (responseObj.success) {
                            var themes = responseObj.themes;
                            if (!window.ckeditorApplyThemeWindow) {
                                window.ckeditorApplyThemeWindow = Ext.create('widget.window', {
                                    title: 'Apply Theme',
                                    height: 200,
                                    closeAction: 'destroy',
                                    width: 400,
                                    buttonAlign: 'center',
                                    layout: 'fit',
                                    buttons: [
                                        {
                                            text: 'Apply Styles',
                                            handler: function (btn) {
                                                var stylesheets = [],
                                                    checkBoxes = btn.up('window').down('#stylesheetCheckboxFieldset').query('checkboxfield');
                                                Ext.each(checkBoxes, function (checkBox) {
                                                    if (checkBox.getValue()) {
                                                        stylesheets.push(checkBox.getSubmitValue());
                                                    }
                                                });

                                                editor.config.contentsCss = stylesheets;
                                                var data = editor.getData(),
                                                    modeEditor = editor.getMode(editor.mode),
                                                    holderElement = editor.getThemeSpace('contents');

                                                modeEditor.load(holderElement, data);

                                                btn.up('window').close();
                                                window.ckeditorApplyThemeWindow = null;
                                            }
                                        },
                                        {
                                            text: 'Cancel',
                                            handler: function (btn) {
                                                btn.up('window').close();
                                                window.ckeditorApplyThemeWindow = null;
                                            }
                                        }
                                    ],
                                    items: {
                                        xtype: 'form',
                                        frame: true,
                                        bodyStyle: 'padding:5px 5px 0',
                                        defaults: {
                                            bodyPadding: 4
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                fieldLabel: 'Themes',
                                                name: 'Theme',
                                                queryMode: 'local',
                                                displayField: 'name',
                                                valueField: 'theme_id',
                                                store: {
                                                    fields: ['name', 'theme_id'],
                                                    data: themes
                                                },
                                                listeners: {
                                                    change: function (combo, oldValue, newValue) {
                                                        var fieldset = combo.up('form').down('#stylesheetCheckboxFieldset'),
                                                            theme = themes.select('theme_id = "' + newValue + '"').first();

                                                        fieldset.removeAll();

                                                        Ext.each(theme.stylesheets, function (stylesheet) {
                                                            fieldset.add({
                                                                xtype: 'checkboxfield',
                                                                boxLabel: stylesheet.name,
                                                                name: stylesheet.name,
                                                                inputValue: stylesheet.url
                                                            });
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                type: 'fieldset',
                                                frame: false,
                                                title: 'Stylesheets',
                                                itemId: 'stylesheetCheckboxFieldset'
                                            }
                                        ]
                                    }
                                });
                            }
                            window.ckeditorApplyThemeWindow.show();
                        }
                    },
                    error: function (response) {

                    }
                });
            }
        },
    //Section 2 : Create the button and add the functionality to it
        b = 'knitkitthemes';
    CKEDITOR.plugins.add(b, {
        init: function (editor) {
            editor.addCommand(b, a);
            editor.ui.addButton('KnitkitThemes', {
                label: 'Apply Theme',
                icon: '/images/erp_app/desktop/themes.png',
                command: b
            });
        }
    });
})();
