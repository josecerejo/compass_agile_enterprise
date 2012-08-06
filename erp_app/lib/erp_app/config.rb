module ErpApp
  module Config
    class << self
      attr_accessor :widgets, :session_warn_after, :session_redirect_after

      def init!
        @defaults = {
            :@widgets => [],
            :@session_warn_after => 18, #in minutes
            :@session_redirect_after => 20,#in minutes
        }
      end

      def reset!
        @defaults.each do |k, v|
          instance_variable_set(k, v)
        end
      end

      def configure(&blk)
        @configure_blk = blk
      end

      def configure!
        @configure_blk.call(self) if @configure_blk
      end
    end
    init!
    reset!
  end
end
