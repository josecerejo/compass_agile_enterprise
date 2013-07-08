Ext.define('Compass.ErpApp.Desktop.Applications.Tail.TailPanel',{
	extend: 'Ext.Panel',
    alias: 'widget.tail-tailpanel',
	tailing: false,
	docked:'top',
	cursor: 0,
	tailTask: null,
	autoScroll:true,
	
	dockedItems:[
		{
			xtype:'toolbar',
			items:[
				{
					text:'Start Tailing',
					itemId: 'start',
					handler:function(btn){
						var startBtn = btn,
							endBtn = btn.up('panel').down('#stop'),
							panel = btn.up('panel');
							
						Ext.createWidget('window', {
							title:'Start Tailing',
							buttonAlign:'center',
							items:[
								{
									xtype:'form',
									bodyPadding:'5px',
									defaults:{
										xtype:'numberfield'
									},
									items:[
										{
											fieldLabel:'Interval In Seconds',
											value: '5',
											name:'seconds'
										}
									]
								}
							],
							buttons:[
								{
									text:'Start',
									handler:function(btn){
										var window = btn.up('window'),
											values = btn.up('window').down('form').getValues();
										
										panel.startTailing(values);	
										startBtn.disable();
										endBtn.enable();
										window.close();
									}
								},
								{
									text:'Cancel',
									handler:function(btn){
										btn.up('window').close();
									}
								}
							]
						}).show();	
					}
				},
				{
					text: 'Stop Tailing',
					itemId: 'stop',
					disabled: true,
					handler: function(btn){
						var startBtn = btn.up('panel').down('#start'),
							panel = btn.up('panel');
						
						panel.stopTailing();
						btn.disable();
						startBtn.enable();
					}
				},
				{
					text: 'Clear',
					itemId: 'clear',
					handler: function(btn){
						var panel = btn.up('panel');
						
						panel.update('');
					}
				}
			]
		}	
	],
	html: '',
	bodyStyle: {
		backgroundColor: 'black',
		color: 'yellow'
	},
	
	startTailing: function(values){
		this.tailing = true;
        this.cursor = 0;
		if(this.tailTask){
			this.tailTask.start();
		}
		else{
			var runner = new Ext.util.TaskRunner();
			this.tailTask = runner.newTask({
			    run: this.tail,
			    interval: (parseInt(values['seconds']) * 1000),
				scope: this
			});
			this.tailTask.start();
		}
	},
	
	stopTailing: function(){
		this.tailTask.stop();
		this.tailing = false;
	},
	
	tail: function(){
		var me = this;
		
		if(me.tailing){
			Ext.Ajax.request({
				url: '/erp_app/desktop/tail/get_tail',
				params:{
					cursor: me.cursor
				},
				success:function(response){
					responseObj = Ext.JSON.decode(response.responseText);
					if(responseObj.success){
						me.cursor = responseObj.cursor;
						me.update(me.body.dom.innerHTML + responseObj.tail);
						
						var d = me.body.dom;
						d.scrollTop = d.scrollHeight - d.offsetHeight;
					}
				},
				failure:function(){
					
				}
			});
		}
		else{
			this.tailTask.stop();
		}
	}
});