class ValidNoteType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  belongs_to :note_type
  belongs_to :valid_note_record, :polymorphic => true
end
