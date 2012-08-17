(function(){
    //Section 1 : Code to execute when the toolbar button is pressed
    var a = {
        exec:function(editor){
            if(editor.checkDirty()){
                data = editor.getData();
                Knitkit.InlineEditing.contentDiv.html(data);

                jQuery.ajax({
                    url: "/knitkit/erp_app/desktop/content/update",
                    data: {
                        id:Knitkit.InlineEditing.contentId,
                        html:data,
                        site_id:Knitkit.InlineEditing.websiteId
                    },
                    success:function(result, status, xhr){
                        Knitkit.InlineEditing.saved(editor, result, status, xhr);
                    },
                    error:function(xhr, status, error){
                        Knitkit.InlineEditing.error(xhr, status, error);
                    }
                });
            }
        }
    },
    //Section 2 : Create the button and add the functionality to it
    b = 'inlineeditsave';
    CKEDITOR.plugins.add(b,{
        init:function(editor){
            editor.addCommand(b,a);
            editor.ui.addButton('InlineEditSave',{
                label:'Save',
                icon: '/images/icons/save/save_16x16.png',
                command:b
            });
        }
    });
})();
