Knitkit.InlineEditing = {
    setup:function(){
        jQuery('div.knitkit_content').bind('mouseenter', function(){
            var div = $(this);
            div.addClass('knitkit-inlineedit-editable')
        });

        jQuery('div.knitkit_content').bind('mouseleave', function(){
            var div = $(this);
            div.removeClass('knitkit-inlineedit-editable')
        });

        jQuery('div.knitkit_content').bind('dblclick', function(){
            var div = $(this);
            div.wrapInner('<textarea name="inline-edit-textarea" id="inline-edit-textarea" />');
            CKEDITOR.replace('inline-edit-textarea');

        });
    }
}
