module ErpApp
	class LoginController < ApplicationController
	  layout :nil
	  
	  def index
	    if params[:application] == 'csr'
	      @app_container = '/erp_app/organizer/'
	    else
	      @app_container = '/erp_app/desktop/'
      end
	  end
	  
	end
end