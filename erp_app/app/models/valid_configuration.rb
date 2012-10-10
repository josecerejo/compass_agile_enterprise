class ValidConfiguration < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :configured_item, :polymorphic => true
  belongs_to :configuration, :dependent => :destroy
end
