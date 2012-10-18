Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.DynamicDataGridPanel",{
    extend:"Compass.ErpApp.Shared.DynamicEditableGridLoaderPanel",
    alias:'widget.dynamic_forms_DynamicDataGridPanel',

    addCommentWindow : function(record_id, model_name, comment_div_id){
        var commentForm = {
            url: '/erp_forms/erp_app/desktop/dynamic_forms/comments/add',
            xtype: 'form',
            items: [{
                xtype: 'textarea',
                name: 'comment',
                width: 800,
                height: 400
            }],
            buttons:[{
                text:'Submit',
                listeners:{
                  'click':function(button){
                    var formPanel = button.findParentByType('form');
                    //self.setWindowStatus('Adding Comment ...');
                    formPanel.getForm().submit({
                      params:{
                        id:record_id,
                        model_name:model_name
                      },
                      reset:false,
                      success:function(form, action){
                        //self.clearWindowStatus();
                        var obj =  Ext.decode(action.response.responseText);
                        if(obj.success){
                            var randomnumber=Math.floor(Math.random()*1024)
                            var target_div = 'new-comment-'+randomnumber;
                            string = '<div id="'+target_div+'" class="comment">';
                            string += '<i>by you, just now</i><br />';
                            string += formPanel.getForm().findField('comment').getValue();
                            string += '</div>';
                            document.getElementById(comment_div_id).innerHTML += string;
                            Ext.getCmp('commentWindow_'+model_name+record_id).close();
                            codemirrorHighlight(target_div);
                        }
                        else{
                          Ext.Msg.alert("Error", obj.msg);
                        }
                      },
                      failure:function(form, action){
                        //self.clearWindowStatus();
                        var obj =  Ext.decode(action.response.responseText);
                        if(Compass.ErpApp.Utility.isBlank(obj.message)){
                          Ext.Msg.alert("Error", 'Error adding comment.');
                        }
                        else{
                          Ext.Msg.alert("Error", obj.message);
                        }
                      }
                    });
                  }
                }
            }]
        }

        var commentWindow = Ext.create('Ext.window.Window',{
            id: 'commentWindow_'+model_name+record_id,
            title: 'Add Comment',
            items: [commentForm],
            autoDestroy:true
        });

        commentWindow.show();
        
    },

    viewRecord : function(rec, gridpanel_id){
        var self = this;
        Ext.getCmp('westregionPanel').setWindowStatus('Getting data ...');
        Ext.Ajax.request({
            url: '/erp_forms/erp_app/desktop/dynamic_forms/data/get',
            method: 'POST',
            params:{
                id:rec.get("id"),
                model_name:rec.get("model_name")
            },
            success: function(response) {
                Ext.getCmp('westregionPanel').clearWindowStatus();
                var response_text = Ext.decode(response.responseText);
                var center_region = self.findParentByType('dynamic_forms_centerregion');

                var ticket_div_id = gridpanel_id+'_ticket';

                string = '<div id="'+ticket_div_id+'" style="padding: 10px;">';
                string += '<div class="metadata">';
                string += 'Created by '+response_text.metadata.created_username+' at '+response_text.metadata.created_at+'<br/>';
                string += 'Updated';
                if (response_text.metadata.updated_username){
                    string += ' by '+response_text.metadata.updated_username;                    
                }
                if (response_text.metadata.updated_at){
                    string += ' at '+response_text.metadata.updated_at;                    
                }
                string += '</div>';
                for(var index in response_text.data) {
                    string += '<b>'+ index + ':</b> ' + response_text.data[index] + '<br />';
                }
                string += '</div>';

                var comment_div_id = gridpanel_id+'_comments';

                if (response_text.comments){
                    string += '<div id="'+comment_div_id+'" class="comments"><h1>Comments ';
                    string += '<a onclick="javascript: Ext.getCmp(\''+gridpanel_id+'\').addCommentWindow('+rec.get("id")+',\''+rec.get("model_name")+'\',\''+comment_div_id+'\');" href="#">Add Comment</a></h1>';

                    Ext.each(response_text.comments, function(comment){
                        string += '<div class="comment">';
                        string += '<i>by '+comment.commentor_name+ ', '+comment.created_at+'</i><br />';
                        string += comment.comment;
                        string += '</div>';
                    });
                    
                    string += '</div>';
                }

                var viewPanel = {
                    xtype: 'panel',
                    title: rec.get("model_name")+' '+rec.get("id"),
                    closable: true,
                    autoScroll: true,
                    record: rec,
                    html: string,
                    items: [],
                    listeners:{
                        'afterrender':function(){
                            codemirrorHighlight(ticket_div_id);
                            codemirrorHighlight(comment_div_id);
                        }
                    }
                }

                center_region.workArea.add(viewPanel);
                center_region.workArea.setActiveTab(center_region.workArea.items.length - 1);
            },
            failure: function(response) {
                Ext.getCmp('westregionPanel').clearWindowStatus();
                Ext.Msg.alert('Error', 'Error getting data');
            }
        });
    },
    
    editRecord : function(rec, model_name){
        var self = this;
        Ext.getCmp('westregionPanel').setWindowStatus('Getting update form...');
        Ext.Ajax.request({
            url: '/erp_forms/erp_app/desktop/dynamic_forms/forms/get',
            method: 'POST',
            params:{
                id:rec.get("form_id"),
                record_id:rec.get("id"),
                model_name:model_name,
                form_action: 'update'
            },
            success: function(response) {
                Ext.getCmp('westregionPanel').clearWindowStatus();
                form_definition = Ext.decode(response.responseText);
                if (form_definition.success == false){
                    Ext.Msg.alert('Error', form_definition.error);
                }else{
                    var editRecordWindow = Ext.create("Ext.window.Window",{
                        layout:'fit',
                        title:'Update Record',
                        plain: true,
                        buttonAlign:'center',
                        items: form_definition                            
                    });
                    Ext.getCmp('dynamic_form_panel_'+model_name).getForm().loadRecord(rec);                
                    editRecordWindow.show();
                }
            },
            failure: function(response) {
                Ext.getCmp('westregionPanel').clearWindowStatus();
                Ext.Msg.alert('Error', 'Error getting form');
            }
        });
    },
    
    deleteRecord : function(rec, model_name){
        var self = this;
        Ext.getCmp('westregionPanel').setWindowStatus('Deleting record...');
        Ext.Ajax.request({
            url: '/erp_forms/erp_app/desktop/dynamic_forms/data/delete',
            method: 'POST',
            params:{
                id:rec.get("id"),
                model_name:model_name
            },
            success: function(response) {
                var obj =  Ext.decode(response.responseText);
                if(obj.success){
                    Ext.getCmp('westregionPanel').clearWindowStatus();
                    self.query('shared_dynamiceditablegrid')[0].store.load();
                }
                else{
                    Ext.Msg.alert('Error', 'Error deleting record');
                    Ext.getCmp('westregionPanel').clearWindowStatus();
                }
            },
            failure: function(response) {
                Ext.getCmp('westregionPanel').clearWindowStatus();
                Ext.Msg.alert('Error', 'Error deleting record');
            }
        });
    },
    
    constructor : function(config) {
        config = Ext.apply({
            id:config.id,
            //title:'Dynamic Data',
            editable:false,
            page:true,
            pageSize: 20,
            displayMsg:'Displaying {0} - {1} of {2}',
            emptyMsg:'Empty',
            grid_listeners:{
                'itemdblclick':function(view, record){
                    Ext.getCmp(config.id).viewRecord(record, config.id);
                }
            }
        }, config);

        this.callParent([config]);
    }
});

