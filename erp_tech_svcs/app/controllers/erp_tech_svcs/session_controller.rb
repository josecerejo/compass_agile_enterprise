module ErpTechSvcs
  class SessionController < ActionController::Base
    def create
      last_login_at = nil
      potential_user = User.where('username = ? or email = ?', params[:login], params[:login]).first
      last_login_at = potential_user.last_login_at unless potential_user.nil?
        if login(params[:login],params[:password])
          #log when someone logs in
          ErpTechSvcs::ErpTechSvcsAuditLog.successful_login(current_user)

          #set logout
          session[:logout_to] = params[:logout_to]

          login_to = session[:return_to_url] or (last_login_at.nil? ? params[:first_login_to] : params[:login_to])
          request.xhr? ? (render :json => {:success => true, :login_to => login_to}) : (redirect_to login_to)
        else
          message = "Login failed. Try again"
          flash[:notice] = message
          request.xhr? ? (render :json => {:success => false, :errors => {:reason => message}}) : (render :text => message)
        end
    end

    def destroy
      message = "You have logged out."
      logged_out_user_id = current_user.id unless current_user === false
      logout_to          = session[:logout_to]

      logout

      #log when someone logs out
      ErpTechSvcs::ErpTechSvcsAuditLog.successful_logout(logged_out_user_id) if logged_out_user_id

      if logout_to
        redirect_to logout_to, :notice => message
      else
        login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
        redirect_to login_url, :notice => message
      end

    end

    def keep_alive
      render :json => {:success => true, :last_activity_at => current_user.last_activity_at}
    end
  end#SessionsController
end#ErpTechSvcs