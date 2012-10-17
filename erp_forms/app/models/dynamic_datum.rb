class DynamicDatum < ActiveRecord::Base
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
  # options = {:with_prefix => false, :use_label => false, :all => false}
  # :with_prefix = false will remove the dyn_ from the attribute key
  # if :with_prefix is false, you may choose to use the fieldLabel as the hash key by setting :use_label = true 
  # :use_label is useful displaying data on a view screen or formatting an email
  # :all = false will only return attributes that are in the form definition
  # :all = true will return all attributes with those not in the form definition last
  # you can set :all = true and :use_label = true, but attributes not in definition will use key.titleize
  # if for some reason a form cannot be found, sorting will not be attempted
  def sorted_dynamic_attributes(options={})
    options[:with_prefix] = false if options[:with_prefix].nil?
    options[:use_label] = false if options[:use_label].nil?
    options[:all] = true if options[:all].nil?

    form = self.updated_with_form if form.nil? and !self.updated_with_form.nil?
    form = self.created_with_form if form.nil? and !self.created_with_form.nil?
    form = DynamicForm.get_form(self.reference_type) if form.nil?
    
    unless form.nil?
      if options[:with_prefix]
        keys = form.definition_object.collect{|f| DYNAMIC_ATTRIBUTE_PREFIX + f[:name]}
      else        
        labels = form.definition_object.collect{|f| f[:fieldLabel]} if options[:use_label]
        keys = form.definition_object.collect{|f| f[:name]}
      end

      sorted = {}
      i=0
      keys.each do |key|
        if options[:with_prefix]
          sorted[key] = self.dynamic_attributes[key]
        else
          index = (options[:use_label] ? labels[i] : key)
          sorted[index] = self.dynamic_attributes_without_prefix[key]
        end        

        i += 1
      end
      
      if options[:all]
        # append attributes not in definition
        attrs = (options[:with_prefix] ? self.dynamic_attributes : self.dynamic_attributes_without_prefix)
        sorted.each do |k,v|
          attrs.delete(k)
        end
        attrs.each do |k,v|
          if options[:with_prefix]
            sorted[k] = self.dynamic_attributes[k]
          else
            index = (options[:use_label] ? k.titleize : k)
            sorted[index] = self.dynamic_attributes_without_prefix[k]
          end
        end
      end

      return sorted
    else
      if options[:with_prefix]
        return self.dynamic_attributes
      else
        return self.dynamic_attributes_without_prefix
      end
    end
  end
end