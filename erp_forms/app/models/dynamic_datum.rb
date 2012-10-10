class DynamicDatum < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  DYNAMIC_ATTRIBUTE_PREFIX = 'dyn_'
  
  has_dynamic_attributes :dynamic_attribute_prefix => DYNAMIC_ATTRIBUTE_PREFIX, :destroy_dynamic_attribute_for_nil => false

  belongs_to :reference, :polymorphic => true
  belongs_to :created_with_form, :class_name => "DynamicForm"
  belongs_to :updated_with_form, :class_name => "DynamicForm"
  belongs_to :created_by, :class_name => "User"
  belongs_to :updated_by, :class_name => "User"
  
  def dynamic_attributes_without_prefix
    attrs = {}
    self.dynamic_attributes.each do |k,v|
      attrs[k[DYNAMIC_ATTRIBUTE_PREFIX.length..(k.length)]] = v
    end

    attrs
  end

  def dynamic_attributes_with_related_data(related_fields=[], use_label=false)
    key = (use_label ? :fieldLabel : :name)
    data = sorted_dynamic_attributes(false, use_label)
    related_fields.each do |r|
      data.each do |k,v|
        if k == r[key]
          data[k] = r[:extraParams]['model'].camelize.constantize.find(v).send(r[:displayField]) rescue nil
        end
      end
    end

    data
  end

  # we cannot assume that dynamic attributes are stored in order in the database as this is often not the case
  # this method will sort them according to the order of the fields in the form definition
  # method returns an ordered hash
  # if with_prefix is false, you may choose to use the fieldLabel as the hash key, this is useful displaying data on a view screen
  def sorted_dynamic_attributes(with_prefix=false, use_label=false)    
    form = self.updated_with_form if form.nil? and !self.updated_with_form.nil?
    form = self.created_with_form if form.nil? and !self.created_with_form.nil?
    form = DynamicForm.get_form(self.reference_type) if form.nil?
    
    unless form.nil?
      if with_prefix
        keys = form.definition_object.collect{|f| DYNAMIC_ATTRIBUTE_PREFIX + f[:name]}
      else        
        labels = form.definition_object.collect{|f| f[:fieldLabel]} if use_label
        keys = form.definition_object.collect{|f| f[:name]}
      end

      sorted = {}
      i=0
      keys.each do |key|
        if with_prefix
          sorted[key] = self.dynamic_attributes[key]
        else
          index = (use_label ? labels[i] : key)
          sorted[index] = self.dynamic_attributes_without_prefix[key]
        end        

        i += 1
      end
      
      return sorted
    else
      if with_prefix
        return self.dynamic_attributes
      else
        return self.dynamic_attributes_without_prefix
      end
    end
  end
  
end