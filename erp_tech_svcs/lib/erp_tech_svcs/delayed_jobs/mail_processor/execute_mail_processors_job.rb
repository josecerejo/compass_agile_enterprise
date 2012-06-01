module ErpTechSvcs
  module DelayedJobs
    module MailProcessor
      class ExecuteMailProcessorsJob
        def initialize
          @priority = 1
        end

        def perform
          Rails.application.config.erp_tech_svcs.mail_processors.each do |mail_processor|
            mail_processor.check_mail
          end

          # Run every ...
          start_time = Time.now.in_time_zone + Rails.application.config.erp_tech_svcs.execute_mail_processors_job_delay.minutes

          Delayed::Job.enqueue(ExecuteMailProcessorsJob.new, @priority, start_time)
        end

        def self.schedule_job(schedule_at)
          Delayed::Job.enqueue(ExecuteMailProcessorsJob.new, @priority, schedule_at)
        end

      end #ExecuteMailProcessorsJob
    end # MailProcessor
  end # DelayedJobs
end # ErpTechSvcs