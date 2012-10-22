Ext.onReady(function(){
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        file : function(value, field) {
            var file_size = ErpTechSvcs.Config.max_file_size_in_mb * 1024 * 1024;
            var file_types = ErpTechSvcs.Config.file_upload_types.replace(/\s/g,'|').replace(/,/g,'|');
            //var fileName = new RegExp('^.*\.('+file_types+')$','i');
            var fileName = eval('/^.*\.('+file_types+')$/i');
            // console.log(file_size);
            // console.log(field.inputEl.dom.files[0].size);
            // if (field.inputEl.dom.files[0].size > file_size)) return false;
            return fileName.test(value);
        },
        // vtype Text property to display error Text
        // when the validation function returns false
        fileText : "File must be no larger than "+ErpTechSvcs.Config.max_file_size_in_mb+"MB and one of the following file types: "+ErpTechSvcs.Config.file_upload_types,
        // vtype Mask property for keystroke filter mask
        fileMask : /[a-z_\.]/i
    });
});