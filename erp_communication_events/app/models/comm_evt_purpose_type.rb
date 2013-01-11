class CommEvtPurposeType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_and_belongs_to_many :communication_events,
    :join_table => 'comm_evt_purposes'

  def to_label
    "#{description}"
  end

  def to_s
    "#{description}"
  end

end
