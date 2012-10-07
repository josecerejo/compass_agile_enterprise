class NoteType < ActiveRecord::Base
  attr_accessible :description, :internal_identifier
  
  acts_as_nested_set
  acts_as_erp_type

  belongs_to :note_type_record, :polymorphic => true
  has_many   :notes
end
