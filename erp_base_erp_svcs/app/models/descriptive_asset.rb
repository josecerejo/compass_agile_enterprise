class DescriptiveAsset < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :view_type
  belongs_to :described_record, :polymorphic => true
end
