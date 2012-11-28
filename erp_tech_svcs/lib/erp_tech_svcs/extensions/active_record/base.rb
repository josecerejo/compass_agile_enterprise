::ActiveRecord::Base.class_eval do

  # class method to get superclass of ActiveRecord model
  def self.get_superclass(class_name)
    klass = Module.const_get(class_name)
    while klass.superclass != ::ActiveRecord::Base do
      klass = klass.superclass
    end
    return klass.name
  end

  # instance method to get superclass of ActiveRecord model
  def get_superclass
    self.class.get_superclass(self.class.name)
  end

end
