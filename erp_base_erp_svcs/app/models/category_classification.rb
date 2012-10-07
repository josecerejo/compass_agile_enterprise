class CategoryClassification < ActiveRecord::Base
  attr_accessible :category, :classification

  belongs_to :classification, :polymorphic => true
  belongs_to :category
end
