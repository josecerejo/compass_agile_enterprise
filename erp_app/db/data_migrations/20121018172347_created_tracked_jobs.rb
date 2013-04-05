class CreatedTrackedJobs
  
  def self.up    
    JobTracker.create(
        :job_name => 'Delete Expired Sessions',
        :job_klass => 'ErpTechSvcs::Sessions::DeleteExpiredSessionsJob'
      )
  end
  
  def self.down
    #remove data here
  end

end
