Knitkit.InlineEditing = {
    contentDiv:null,
    websiteId:null,
    contentId:null,

    closeEditor:function (editor) {
        editor.destroy();
        jQuery('#editableContentContainer').remove();
        jQuery('#editableContentOverlay').remove();
    },

    saved:function (editor, result, status, xhr) {
        if (result.success === true) {
            this.closeEditor(editor);
        }
        else {
            jQuery('#inlineEditSaveResult').html(" Could not update.  Please try again.");
        }
    },

    error:function (xhr, status, error) {
        jQuery('#inlineEditSaveResult').html(" Could not update.  Please try again.");
    },

    closeEditorClick:function () {
        //make sure modal is not already showing
        if ($("#warning-modal").length === 0) {
            var editor = CKEDITOR.instances['inlineEditTextarea'];
            if (editor.checkDirty()) {
                jQuery('#editableContentOverlay').css('z-index','1003');

                var warningModal = jQuery("<div id='warning-modal'></div>");
                warningModal.append('<span>You have unsaved changes. Are you sure you want to exit?</span><br/><br/>');

                var noBtn = jQuery('<input class="warning-btn" type="button" value="No" />');
                noBtn.bind('click', function () {
                    warningModal.remove();
                    jQuery('#editableContentOverlay').css('z-index','1001');
                });

                var yesBtn = jQuery('<input class="warning-btn" type="button" value="Yes" />');
                yesBtn.bind('click', function () {
                    Knitkit.InlineEditing.closeEditor(editor);
                    warningModal.remove();
                });

                warningModal.append(noBtn);
                warningModal.append(yesBtn);
                jQuery("body").append(warningModal);
            }
            else {
                Knitkit.InlineEditing.closeEditor(editor);
            }
        }
        return false;
    },

    setup:function (websiteId) {
        this.websiteId = websiteId;

        jQuery('div.knitkit_content').bind('mouseenter', function () {
            var div = jQuery(this);
            div.addClass('knitkit-inlineedit-editable');
        });

        jQuery('div.knitkit_content').bind('mouseleave', function () {
            var div = jQuery(this);
            div.removeClass('knitkit-inlineedit-editable');
        });

        jQuery('div.knitkit_content').bind('click', function () {
            var self = Knitkit.InlineEditing;
            var div = jQuery(this);
            self.contentId = div.attr('contentid');
            self.lastUpdate = div.attr('lastupdate');
            var data = div.html();

            var textarea = jQuery('<textarea name="inline-edit-textarea" id="inlineEditTextarea" ></textarea>');
            var closeLink = jQuery("<a class='inline-edit-close'><img src='images/knitkit/close.png' /></a>");
            var messageSpan = jQuery("<span class='inline-edit-message' id='inlineEditMessage'>Last Update: <span id='inlineEditLastUpdate'>" + self.lastUpdate + "</span><span id='inlineEditSaveResult'></span></span>");

            var editableContentContainer = jQuery("<div id='editableContentContainer' class='modal-container'></div>");
            var ckeditorWrapper = jQuery("<div class='ckeditor_wrapper'></div>");
            var actionResultDiv = jQuery("<div class='editable-content-actionresult'></div>");

            editableContentContainer.append(ckeditorWrapper);
            ckeditorWrapper.append(textarea);
            editableContentContainer.append(actionResultDiv);
            actionResultDiv.append(closeLink);
            actionResultDiv.append(messageSpan);

            var overlay = jQuery("<div id='editableContentOverlay' class='modal-overlay'></div>");

            jQuery("body").append(editableContentContainer);
            jQuery("body").append(overlay);

            closeLink.bind('click', self.closeEditorClick);

            CKEDITOR.replace('inline-edit-textarea',
                {
                    height:320,
                    enterMode:CKEDITOR.ENTER_BR,
                    extraPlugins:'inlineeditsave,jwplayer',
                    toolbar:[
                        { name:'document', items:[ 'Source', '-', 'InlineEditSave', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates' ] },
                        { name:'clipboard', items:[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                        { name:'editing', items:[ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt' ] },
                        { name:'forms', items:[ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                            'HiddenField' ] },
                        '/',
                        { name:'basicstyles', items:[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
                        { name:'paragraph', items:[ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
                            '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ] },
                        { name:'links', items:[ 'Link', 'Unlink', 'Anchor' ] },
                        { name:'insert', items:[ 'Image', 'Flash', 'jwplayer', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
                        '/',
                        { name:'styles', items:[ 'Styles', 'Format', 'Font', 'FontSize' ] },
                        { name:'colors', items:[ 'TextColor', 'BGColor' ] },
                        { name:'tools', items:[ 'Maximize', 'ShowBlocks', '-', 'About' ] }
                    ],
                    on:{
                        instanceReady:function (ev) {
                            Knitkit.InlineEditing.contentDiv = div;
                            this.setData(data);
                            this.focus();
                        },
                        dataReady:function (ev) {
                            this.resetDirty();
                        }
                    }

                });

        });
    }
}
