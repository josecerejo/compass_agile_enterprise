class Capability < ActiveRecord::Base

  belongs_to :scope_type
  belongs_to :capability_type
  belongs_to :capability_resource, :polymorphic => true
  has_many :capability_accessors, :dependent => :destroy

  alias :type :capability_type
end
