Ext.define('Compass.ErpApp.Mobile.JobTracker.Store.Jobs', {
  extend: 'Ext.data.Store',
  config: {
    model: 'Compass.ErpApp.Mobile.JobTracker.Job',
    proxy:{
      autoLoad: true,
      url:'/erp_app/desktop/job_tracker/jobs',
      type:'ajax',
      reader:{
        type:'json',
        rootProperty:'jobs'
      }
    }
  }
});

