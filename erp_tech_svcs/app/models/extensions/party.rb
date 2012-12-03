Party.class_eval do
  has_security_roles
  has_one :user, :dependent => :destroy
end
