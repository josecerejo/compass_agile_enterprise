class Capability < ActiveRecord::Base
  attr_protected :created_at, :updated_at
  
  belongs_to :scope_type
  belongs_to :capability_type
  belongs_to :capability_resource, :polymorphic => true
  has_many :capability_accessors, :dependent => :destroy

  alias :type :capability_type


  def roles_not
    SecurityRole.joins("LEFT JOIN capability_accessors ON capability_accessors.capability_id = #{self.id}
                        AND capability_accessors.capability_accessor_record_type = 'SecurityRole' 
                        AND capability_accessors.capability_accessor_record_id = security_roles.id").
                where("capability_accessors.id IS NULL")
  end

  def roles
    SecurityRole.joins(:capability_accessors).where(:capability_accessors => {:capability_id => self.id })
  end

  def users_not
    User.joins("LEFT JOIN capability_accessors ON capability_accessors.capability_id = #{self.id}
                        AND capability_accessors.capability_accessor_record_type = 'User' 
                        AND capability_accessors.capability_accessor_record_id = users.id").
        where("capability_accessors.id IS NULL")
  end

  def users
    User.joins(:capability_accessors).where(:capability_accessors => {:capability_id => self.id })
  end

  def groups_not
    Group.joins("LEFT JOIN capability_accessors ON capability_accessors.capability_id = #{self.id}
                        AND capability_accessors.capability_accessor_record_type = 'Group' 
                        AND capability_accessors.capability_accessor_record_id = groups.id").
          where("capability_accessors.id IS NULL")
  end

  def groups
    Group.joins(:capability_accessors).where(:capability_accessors => {:capability_id => self.id })
  end

end
