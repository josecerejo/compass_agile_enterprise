// Nice little plugin from http://www.learnsomethings.com/2012/03/16/extjs4-x-plugin-that-adds-a-help-icon-and-rich-tooltip-to-your-field-labels/
// modified to allow for tooltips on all field types, not just comboboxes as well as
// support for labelAlign 'left' in addition to 'top'

Ext.util.CSS.createStyleSheet('.icon-help{ background-image:url(/images/help.jpg) !important; background-repeat:no-repeat; background-position:center; }', 'helpQtip');
helpQtip = function(txt) {
    return {
        init: function(me) {
            var label = me.fieldLabel; 
            //var xt        = me.getXType().substr(4);
            //if (xt == 'field' || xt == 'obox'){
            // Add in custom onRender and on Destroy events
            var id  = me.getId(), lbl = me.getFieldLabel();
            // Get the fieldLabel element
            Ext.apply( me,{
                render: Ext.Function.createSequence(me.render,function(ct, position) {
                    if (me.labelAlign == 'left'){
                        var domNode = Ext.DomQuery.select('*[id=' + id + '-inputRow]'); 
                        // Create the dom object that contains the question mark image
                        var helpDiv = {
                            tag:'td',
                            id:id + '-help',
                            html:'&nbsp;',
                            cls:'icon-help',                                              
                            style:'display:inline; cursor:help; width:25px; padding:1px 1px 5px 15px;'
                        } // End var helpDiv
                    }else{
                        var domNode = Ext.DomQuery.select('*[id=' + id + '-labelEl]'); 
                        // Create the dom object that contains the question mark image
                        var helpDiv = {
                            tag:'div',
                            id:id + '-help',
                            html:'&nbsp;',
                            cls:'icon-help',                                              
                            style:'display:inline; cursor:help; width:25px; float:right; padding:1px 1px 5px 1px;'
                        } // End var helpDiv
                    }
                    if(domNode){    
                        var tipTxt = '<b>Help</b><br><p>' + txt + '</p>'; 
                        var tipWdth = domNode[0].offsetWidth * 2;   
                        // Add the help div to the document
                        Ext.DomHelper.append(domNode[0],helpDiv);
                        // Attach the help tool tip to the help div
                        var tip = Ext.create('Ext.tip.ToolTip', {
                            target:id + '-help',
                            html: tipTxt,
                            minWidth:tipWdth,
                            title:lbl,
                            autoHide:false,
                            closable:true,
                            closeAction:'hide'
                        });
                    }// End of if(domNode)
                }), // End of render Sequence
                destroy:  Ext.Function.createSequence(me.destroy,function() {
                    var helpDomNode = Ext.DomQuery.select('*[id=' + id + '-help]');     
                    if(helpDomNode){
                        Ext.removeNode(helpDomNode);
                    }
                }) // End of Destroy Sequence
            })// End of Ext.apply
            //}// End of if (xt == 'field') 
        }// End Init Function 
    };
};
