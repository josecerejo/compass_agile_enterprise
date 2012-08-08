(function(){
    //Section 1 : Code to execute when the toolbar button is pressed
    var a = {
        exec:function(editor){
            data = editor.getData();
            Knitkit.InlineEditing.contentDiv.html(data);
            alert('you saved me! I need to call a controller or something.....');
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
