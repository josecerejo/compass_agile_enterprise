class CategoryClassification < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :classification, :polymorphic => true
  belongs_to :category
end
