module ErpApp
  module Desktop
    module JobTracker
      class BaseController < ::ErpApp::Desktop::BaseController

        def jobs
          sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
          sort = sort_hash[:property] || 'id'
          dir = sort_hash[:direction] || 'ASC'
          limit = params[:limit] || 15
          start = params[:start] || 0

          job_trackers = ::JobTracker.order("#{sort} #{dir}").offset(start).limit(limit).all
          total_count = ::JobTracker.count(:id)

          render :json => {:total_count => total_count, :success => true,
                           :jobs => job_trackers.collect { |tracker| tracker.to_hash(
                               :only => [:id, :job_name, :job_klass, :run_time], 
                               :additional_values => {
                                 :scheduled => (tracker.scheduled?),
                                 :last_run_at => (tracker.last_run_at.nil? ? '' : tracker.last_run_at.strftime("%m-%d-%Y %H:%M:%S")),
                                 :next_run_at => (tracker.next_run_at.nil? ? '' : tracker.next_run_at.strftime("%m-%d-%Y %H:%M:%S")),
                                 }) }}
        end

        def schedule
          job_tracker = ::JobTracker.find(params[:id])

          job = job_tracker.tracked_job
          unless job
            job_tracker.job_klass.constantize.schedule_job(Time.now)
            job_tracker.next_run_at = job_tracker.tracked_job.run_at
            job_tracker.save
          end

          render :json => {:success => true}
        end

        def unschedule
          job_tracker = ::JobTracker.find(params[:id])

          job = job_tracker.tracked_job
          job.destroy unless job.nil?

          job_tracker.next_run_at = nil
          job_tracker.save

          render :json => {:success => true}
        end

      end
    end #JobTracker
  end #Desktop
end #ErpApp