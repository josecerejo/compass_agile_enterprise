class DocumentType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  has_many :documents
end
