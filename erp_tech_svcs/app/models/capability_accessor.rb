class CapabilityAccessor < ActiveRecord::Base
  belongs_to :capability_accessor_record, :polymorphic => true
  belongs_to :capability
end
