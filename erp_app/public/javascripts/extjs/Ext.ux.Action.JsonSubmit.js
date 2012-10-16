// Taken from http://www.yannlaviolette.com/2010/07/extjs-formpanel-sending-json-data.html and modified
// This does not post strict JSON but rather will submit your form encoded as JSON within a JSON root variable
// Example: form = myForm.getForm(); form.jsonRoot = 'data'; form.doAction("JsonSubmit",{ });
/**
* The JSON Submit is a Submit action that send JSON instead of send URL Encoded data... You MUST specify the jsonRoot
* property...
* @param form The form to submit
* @param options The options of the HTTP Request
*/
Ext.define('Ext.form.action.JsonSubmit', {
    extend: 'Ext.form.action.Submit',
    alternateClassName: 'Ext.form.Action.JsonSubmit',
    alias: 'formaction.JsonSubmit',
    type: 'JsonSubmit',

    run: function() {
        var method = this.getMethod();
        var isGet = method == 'GET';
        if (this.clientValidation === false || this.form.isValid()) {
            var jsonRoot = (this.form.jsonRoot || 'data');
            var allParams = {};
            allParams[jsonRoot] = Ext.encode(Ext.merge(this.form.baseParams, this.form.getValues()));

            Ext.Ajax.request(Ext.apply(this.createCallback(this.form), {
                url: this.getUrl(isGet),
                method: method,
                waitMsg: "Please wait ...",
                waitTitle: "Please wait",
                isUpload: this.form.fileUpload,
                params: allParams,
                // for strict JSON use below
                // params: Ext.String.format('{{0}: {1}}', this.form.jsonRoot, Ext.encode(this.form.getValues())),
                // headers: {
                //     'Content-Type': 'application/json'
                // }
            }));
        } else if (this.clientValidation !== false) {
            // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    }
});