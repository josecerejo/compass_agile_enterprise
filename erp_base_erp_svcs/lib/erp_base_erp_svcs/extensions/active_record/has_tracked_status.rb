module ErpBaseErpSvcs
  module Extensions
    module ActiveRecord
      module HasTrackedStatus
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          def has_tracked_status
            extend HasTrackedStatus::SingletonMethods
            include HasTrackedStatus::InstanceMethods

            has_many :status_applications, :as => :status_application_record, :dependent => :destroy
          end
        end

        module SingletonMethods
        end

        module InstanceMethods
          #get status for given date
          #checks from_date attribute
          def get_status_for_date_time(datetime)
            status_applications = StatusApplication.arel_table

            arel_query = StatusApplication.where(status_applications[:from_date].gteq(datetime - 1.day).or(status_applications[:from_date].lteq(datetime + 1.day)))

            arel_query.all
          end

          #get status for passed date range from_date and thru_date
          #checks from_date attribute
          def get_statuses_for_date_time_range(from_date, thru_date)
            status_applications = StatusApplication.arel_table

            arel_query = StatusApplication.where(status_applications[:from_date].gteq(from_date - 1.day).or(status_applications[:from_date].lteq(from_date + 1.day)))
            arel_query = arel_query.where(status_applications[:thru_date].gteq(thru_date - 1.day).or(status_applications[:thru_date].lteq(thru_date + 1.day)))

            arel_query.all
          end

          def current_status
            self.status_applications.order('id DESC').first.tracked_status_type.internal_identifier unless self.status_applications.empty?
          end

          #set current status of entity.
          #takes a TrackedStatusType internal_identifier and creates a StatusApplication
          #with from_date set to today and tracked_status_type set to passed TrackedStatusType internal_identifier
          #optionally can passed from_date and thru_date to manually set these
          #it will set the thru_date on the current StatusApplication to now
          def current_status=(args)
            status_iid = nil
            options = {}

            if args.is_a?(Array)
              status = args[0]
              options = args[1]
            else
              status = args
            end
            tracked_status_type = status.is_a?(TrackedStatusType) ? status : TrackedStatusType.find_by_internal_identifier(status.to_s)
            raise "TrackedStatusType does not exists #{status.to_s}" unless tracked_status_type

            #set current StatusApplication thru_date to now
            current_status_application = self.status_applications.last
            unless current_status_application.nil?
              current_status_application.thru_date = options[:thru_date].nil? ? Time.now : options[:thru_date]
              current_status_application.save
            end

            status_application = StatusApplication.new
            status_application.tracked_status_type = tracked_status_type
            status_application.from_date = options[:from_date].nil? ? Time.now : options[:from_date]
            status_application.save

            self.status_applications << status_application
            self.save
          end

        end

      end #HasTrackedStatus
    end #Rezzcard
  end #ActiveRecord
end #Extensions

ActiveRecord::Base.send :include, ErpBaseErpSvcs::Extensions::ActiveRecord::HasTrackedStatus