Ext.onReady(function(){
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        file : function(value, field) {
            // var file_size = ErpTechSvcs.Config.max_file_size_in_mb * 1024 * 1024;
            var file_types = ErpTechSvcs.Config.file_upload_types.replace(/\s/g,'|').replace(/,/g,'|');
            var fileName = eval('/^.*\.('+file_types+')$/i');
            // file size validation only works with ExtJS's inputType == 'file'
            // however its rendering is buggy so we leave it off for now
            // try again when HTML5 is more widly supported
            // if (field.inputEl.dom.files[0].size > file_size)) return false; 
            return fileName.test(value);
        },
        // vtype Text property to display error Text
        // when the validation function returns false
        fileText : "File must be no larger than "+ErpTechSvcs.Config.max_file_size_in_mb+"MB and one of the following file types: "+ErpTechSvcs.Config.file_upload_types,
        // vtype Mask property for keystroke filter mask
        fileMask : /[a-z_\.]/i
    });

    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        emailList : function(value, field) {
            var isvalid = true;
            var emailArray = value.split(',');
            Ext.each(emailArray, function(email){
                if(validateEmail(email) === false) {
                    isvalid = false;
                    return;
                }
            });

            return isvalid;
        },
        // vtype Text property to display error Text
        // when the validation function returns false
        emailListText : "Must be a valid comma separated list of email addresses."
    });

    // custom Vtype for vtype:'IPAddress'
    Ext.apply(Ext.form.field.VTypes, {
        IPAddress:  function(v) {
            return (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/).test(v);
        },
        IPAddressText: 'Must be a numeric IP address',
        IPAddressMask: /[\d\.]/i
    });
});