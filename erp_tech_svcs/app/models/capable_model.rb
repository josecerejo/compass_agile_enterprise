class CapableModel < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :capable_model_record, :polymorphic => true
  has_and_belongs_to_many :capabilities
end
