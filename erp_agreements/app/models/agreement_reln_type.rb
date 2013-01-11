class AgreementRelnType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
  
  belongs_to :valid_from_role, :class_name => "AgreementRoleType", :foreign_key => "valid_from_role_type_id"
  belongs_to :valid_to_role,   :class_name => "AgreementRoleType", :foreign_key => "valid_to_role_type_id"
end
