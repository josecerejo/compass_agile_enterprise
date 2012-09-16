module ErpApp
  module Shared
    class ProfileManagementController < ErpApp::ApplicationController
      before_filter :require_login

      def update_email
        current_user.email = params[:email]
        if current_user.save
          message = "<ul>"
          current_user.errors.collect do |e, m|
            message << "<li>#{e} #{m}</li>"
          end
          message << "</ul>"
          render :json => {:success => true, :message => message}
        else
          render :json => {:success => true, :message => 'Error updating email'}
        end
      end

    end #ProfileManagementController
  end #Desktop
end #ErpApp
