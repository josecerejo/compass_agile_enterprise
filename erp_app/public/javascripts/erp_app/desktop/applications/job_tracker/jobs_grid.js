Ext.define('Compass.ErpApp.Desktop.Applications.JobTracker.Model',{
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',          type: 'int'},
        {name: 'job_name',    type: 'string'},
        {name: 'run_time',    type: 'string'},
		{name: 'scheduled',   type: 'boolean'},
        {name: 'last_run_at', type: 'date', dateFormat:'c'},
        {name: 'next_run_at', type: 'date', dateFormat:'c'}
    ]
});

Ext.create('Ext.data.Store', {
    storeId:'job-tracker-model-store',
    model:'Compass.ErpApp.Desktop.Applications.JobTracker.Model',
	pageSize:15,
    start:0,
    remoteSort:true,
	proxy:{
        type:'ajax',
        url:'/erp_app/desktop/job_tracker/jobs',
        reader:{
            type:'json',
            root:'jobs',
			totalProperty:'total_count'
        }
    }
});

Ext.define("Compass.ErpApp.Desktop.Applications.JobTracker.JobsGrid",{
    extend:"Ext.grid.Panel",
	alias:'widget.jobtracker-jobsgrid',
	autoScroll:true,
	store:Ext.getStore('job-tracker-model-store'),
	columns:[
        {
            header:'Job Name',
            dataIndex:'job_name',
            sortable:false,
            width:200
        },
		{
            header:'Last Ran',
            dataIndex:'last_run_at',
            renderer:function(value){ return (Ext.isEmpty(value) ? 'N/A' : Ext.Date.format(value, 'm-d-Y h:i:s'));},
            width:150
        },
		{
			header:'Run Time',
			dataIndex:'run_time',
            width:100
		},
        {
            header:'Next Run',
            dataIndex:'next_run_at',
            renderer:function(value){ return (Ext.isEmpty(value) ? 'N/A' : Ext.Date.format(value, 'm-d-Y h:i:s'));},
            width:150
        },
        {
	       menuDisabled:true,
	       resizable:false,
	       xtype:'actioncolumn',
	       header:'Status',
	       align:'center',
	       width:46,
	       items:[{
	         getClass: function(v, meta, rec) {
	           var now = new Date();
		   	   var value = rec.get('next_run_at') 
		       if (!Ext.isEmpty(value) && (now > value)) {
		         this.items[0].tooltip = 'Warning';
		         return 'warning-col';
		       } else {
		         this.items[0].tooltip = 'No Problems';
		         return 'accept-col';
		       }
	         },
	         handler: function(grid, rowIndex, colIndex) {
	           return false;
	         }
	       }]
	    },
		{
	       menuDisabled:true,
	       resizable:false,
	       xtype:'actioncolumn',
	       header:'Action',
	       align:'center',
	       width:46,
	       items:[{
	         getClass: function(v, meta, rec) {
	            if(rec.get('scheduled')){
	              this.items[0].tooltip = 'Unschedule';
		          return 'delete-col';
	            }
	            else{
	              this.items[0].tooltip = 'Schedule';
		          return 'schedule-col';
	            }
	         },
	         handler: function(grid, rowIndex, colIndex) {
	        	var rec = grid.getStore().getAt(rowIndex);
	            if(rec.get('scheduled')){
	              grid.ownerCt.unschedule(rec);
	            }
	            else{
	              grid.ownerCt.schedule(rec);
	            }
	         }
	       }]
	    }
    ],
    viewConfig:{
        stripeRows:true
    },

	unschedule : function(rec){
	  var self = this;
	  Ext.Ajax.request({
	    url: '/erp_app/desktop/job_tracker/unschedule',
	    method: 'POST',
	    params:{
	      id:rec.get('id')
	    },
	    success: function(response) {
	      var obj =  Ext.decode(response.responseText);
	      if(obj.success){
	        self.getStore().load();
	      }
	      else{
	        Ext.Msg.alert('Error', 'Error unscheduling job.');
	      }
	    },
	    failure: function(response) {
	      Ext.Msg.alert('Error', 'Error unscheduling job.');
	    }
	  });
	},
	
	schedule : function(rec){
	  var self = this;
	  Ext.Ajax.request({
	    url: '/erp_app/desktop/job_tracker/schedule',
	    method: 'POST',
	    params:{
	      id:rec.get('id')
	    },
	    success: function(response) {
	      var obj =  Ext.decode(response.responseText);
	      if(obj.success){
	        self.getStore().load();
	      }
	      else{
	        Ext.Msg.alert('Error', 'Error scheduling job.');
	      }
	    },
	    failure: function(response) {
	      Ext.Msg.alert('Error', 'Error scheduling job.');
	    }
	  });
	}
});