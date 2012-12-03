class CreateGroupRelationshipAndRoleTypes
  
  def self.up
    #insert data here
    to_role = RoleType.create(:description => 'Security Group', :internal_identifier => 'group')
    from_role = RoleType.create(:description => 'Security Group Member', :internal_identifier => 'group_member')
    RelationshipType.create(:description => 'Security Group Membership', 
                            :name => 'Group Membership', 
                            :internal_identifier => 'group_membership',
                            :valid_from_role => from_role,
                            :valid_to_role => to_role
                          )
  end
  
  def self.down
    #remove data here
  end

end
