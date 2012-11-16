# Security Group
class Group < ActiveRecord::Base
  has_roles
  
  after_create  :create_party
  after_save    :save_party
  after_destroy :destroy_party_relationships, :destroy_party
  
  has_one :party, :as => :business_party

  validates_uniqueness_of :description

  def self.add(description)
    Group.create(:description => description)
  end

  def create_party
    pty = Party.new
    pty.description = self.description
    pty.business_party = self
    
    pty.save
    self.save
  end
    
  def save_party
    self.party.description = self.description
    self.party.save
  end

  def destroy_party
    if self.party
      self.party.destroy
    end
  end
 
  def destroy_party_relationships
    party_relationships.destroy_all
  end

  # group lives on TO side of relationship
  def party_relationships
    PartyRelationship.where(:party_id_to => self.party.id)
  end

  def members
    party_relationships.all.collect{|pr| pr.from_party }
  end
  
  def users
    members.collect{|p| p.user }
  end

  # add user to group
  def add_user(user)
    add_party(user.party)
  end

  # remove user from group
  def remove_user(user)
    remove_party(user.party)
  end

  def get_relationship(a_party)
    PartyRelationship.where(:party_id_to => self.party.id, :party_id_from => a_party.id)
  end

  # add party to group
  # group lives on TO side of relationship
  def add_party(a_party)
    # check and see if party is already a member of this group
    rel = get_relationship(a_party).first
    unless rel.nil?
      # if so, return relationship
      return rel 
    else
      # if not then build party_relationship
      rt = RelationshipType.find_by_internal_identifier('group_membership')
      pr = PartyRelationship.new
      pr.description = rt.description
      pr.relationship_type = rt
      pr.from_role = RoleType.find_by_internal_identifier('group_member')
      pr.to_role = RoleType.find_by_internal_identifier('group')
      pr.from_party = a_party
      pr.to_party = self.party
      pr.save
      return pr
    end
  end

  # remove party from group
  # group lives on TO side of relationship
  def remove_party(a_party)
    begin
      get_relationship(a_party).first.destroy
    rescue Exception => e
      Rails.logger.error e.message
      return nil
    end
  end

end
