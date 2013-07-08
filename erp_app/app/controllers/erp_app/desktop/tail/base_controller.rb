module ErpApp
  module Desktop
    module Tail
      class BaseController < ::ErpApp::Desktop::BaseController
      
        def get_tail
          contents = []

          cursor = params[:cursor].to_i
          
          log_file = File.join(Rails.root, 'log', "#{Rails.env}.log")
          
          File.open(log_file) do |f|
            if cursor == 0
              f.seek(-1, IO::SEEK_END)
            else
              f.seek cursor
            end
          
           if !f.eof?
             contents = f.readlines
             cursor = f.tell
           end
           
          end

          render :json => {:success => true, :tail => contents.join('<br/>'), :cursor => cursor}
        end
      
      end
    end #Tail
  end #Desktop
end #ErpApp