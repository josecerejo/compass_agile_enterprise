module RailsDbAdmin
  class ConnectionHandler
    def self.create_connection_class(database)
      klass = ActiveRecord::Base

      if !database.blank? && Rails.env != database
        klass = Class.new ActiveRecord::Base
        klass.establish_connection(database)
      end

      klass
    end
  end
end

