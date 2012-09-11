module ErpForms::ErpApp::Desktop::DynamicForms
  class CommentsController < ErpForms::ErpApp::Desktop::DynamicForms::BaseController

    def add
      @myDynamicObject = DynamicFormModel.get_constant(params[:model_name]).find(params[:id])
      @comment = @myDynamicObject.add_comment({
          :commentor_name => current_user.party.description, 
          :email => current_user.email, 
          :comment => params[:comment]
        })

      render :json => (@comment.valid? ? {:success => true} : {:success => false})
    end

  end
end
