class ProductOffer < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
	belongs_to :product_offer_record, :polymorphic => true   

  def after_destroy
    if self.product_offer_record && !self.product_offer_record.frozen?
      self.product_offer_record.destroy
    end 
  end	
  
end
