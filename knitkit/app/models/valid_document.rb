class ValidDocument < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :documented_model, :polymorphic => true
  belongs_to :document, :dependent => :destroy
end
