module ErpTechSvcs
  class UserController < ActionController::Base
    def activate
      login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
      if @user = User.load_from_activation_token(params[:activation_token])
        @user.activate!
        redirect_to login_url, :notice => 'User was successfully activated.'
      else
        redirect_to login_url, :notice => "Invalid activation token."
      end
    end

    def update_password
      if user = User.authenticate(current_user.username, params[:old_password])
        user.password_confirmation = params[:password_confirmation]
        if user.change_password!(params[:password])
          success = true
        else
          #### validation failed ####
          message = user.errors.full_messages
          success = false
        end
      else
        message = "Invalid current password."
        success = false
      end

      request.xhr? ? (render :json => {:success => success, :message => message}) : (render :text => message)
    end

    def reset_password
      begin
        login_url = params[:login_url].blank? ? ErpTechSvcs::Config.login_url : params[:login_url]
        if user = (User.find_by_email(params[:login]))
          new_password = Sorcery::Model::TemporaryToken.generate_random_token
          user.password_confirmation = new_password
          if user.change_password!(new_password)
            user.add_instance_attribute(:login_url,login_url)
            user.add_instance_attribute(:domain, params[:domain])
            user.deliver_reset_password_instructions!
            message = "Password has been reset.  An email has been sent with further instructions to #{user.email}."
            success = true
          else
            message = "Error re-setting password."
            success = false
          end
        else
          message = "Invalid user name or email address."
          success = false
        end
        render :json => {:success => success,:message => message}
      rescue Exception=>ex
        logger.error ex.message
        logger.error ex.backtrace
        render :json => {:success => false,:message => 'Error sending email.'}
      end
    end


  end#UserController
end#ErpTechSvcs
