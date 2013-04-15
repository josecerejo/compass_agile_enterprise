Ext.define('Compass.ErpApp.Mobile.JobTracker.Job',{
  extend:'Ext.data.Model',
  config:{
    fields:[
      {name: 'id', type:'integer'},
      {name: 'job_name', type:'string'},
      {name: 'job_klass', type:'string'},
      {name: 'run_time', type:'string'},
      {name: 'last_run_at', type:'date', dateFormat:'m-d-Y g:i:s'},
      {name: 'next_run_at', type:'date', dateFormat:'m-d-Y g:i:s'},
      {name: 'scheduled', type:'boolean'}
    ]
  }
});

