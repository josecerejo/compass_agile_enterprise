Knitkit.InlineEditing = {
    contentDiv:null,
    websiteId:null,
    contentId:null,

    closeEditor:function(editor){
        editor.destroy();
        jQuery('#light').remove();
        jQuery('#fade').remove();
    },

    setup:function (websiteId) {
        this.websiteId = websiteId;

        jQuery('div.knitkit_content').bind('mouseenter', function () {
            var div = jQuery(this);
            div.addClass('knitkit-inlineedit-editable')
        });

        jQuery('div.knitkit_content').bind('mouseleave', function () {
            var div = jQuery(this);
            div.removeClass('knitkit-inlineedit-editable')
        });

        jQuery('div.knitkit_content').bind('click', function () {
            var self = Knitkit.InlineEditing;
            var div = jQuery(this);
            self.contentId = div.attr('content_id');
            var data = div.html();

            var whiteContent = jQuery("<div id='light' class='white_content'></div>");
            var fade = jQuery("<div id='fade' class='black_overlay'></div>");
            var closeLink = jQuery("<a href='javascript:void(0);'>Close</a>");
            var textarea = jQuery('<textarea name="inline-edit-textarea" id="inlineEditTextarea" ></textarea>');
            whiteContent.append(textarea);
            whiteContent.append(closeLink);

            closeLink.bind('click', function () {
                var editor = CKEDITOR.instances['inlineEditTextarea'];
                if(editor.checkDirty()){
                    var result = confirm("You have unsaved content, are you sure you want to close this editor?");
                    if (result===true)
                    {
                        self.closeEditor(editor);
                    }
                }
                else{
                    self.closeEditor(editor);
                }
            });

            jQuery("body").append(whiteContent);
            jQuery("body").append(fade);

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
                        dataReady:function(ev){
                            this.resetDirty();
                        }
                    }

                });

        });
    }
}
