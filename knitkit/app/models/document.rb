class Document < ActiveRecord::Base
  DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX = 'dyn_'
  
  has_dynamic_attributes :dynamic_attribute_prefix => DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX, :destroy_dynamic_attribute_for_nil => false
  
  has_file_assets

  belongs_to :document_record, :polymorphic => true
  belongs_to :document_type
  
  class << self
    def add_dyn_prefix(field)
      "#{DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX}#{field}"
    end
    
    def remove_dyn_prefix(field)
      field.gsub(DOCUMENT_DYNAMIC_ATTRIBUTE_PREFIX, '')
    end
  end
  
  def set_dyn_attribute(field, value)
    self.send("#{Document.add_dyn_prefix(field)}=", value)
  end
  
end
