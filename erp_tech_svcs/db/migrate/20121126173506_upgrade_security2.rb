class UpgradeSecurity2 < ActiveRecord::Migration
  def self.up
    if table_exists?(:secured_models)
      Website.all.each do |w|
        old_role_iid = "website_#{w.name.underscore.gsub("'","").gsub(",","")}_access"

        r = SecurityRole.find_by_internal_identifier(old_role_iid)
        unless r.nil?
          r.internal_identifier = w.website_role_iid
          r.save      
        end
      end
      instance = ScopeType.create(:description => 'Instance', :internal_identifier => 'instance')
      class_scope_type = ScopeType.create(:description => 'Class', :internal_identifier => 'class')
      ScopeType.create(:description => 'Query', :internal_identifier => 'query')

      execute('BEGIN TRANSACTION') 
      puts "populating parties_security_roles"
      sql = 
        "INSERT INTO parties_security_roles (
          party_id,
          security_role_id
        )
        SELECT
          u.party_id AS party_id,
          rsm.role_id AS security_role_id
        FROM secured_models sm 
        JOIN roles_secured_models rsm ON sm.id=rsm.secured_model_id
        JOIN users u ON sm.secured_record_id=u.id
        WHERE sm.secured_record_type='User'"
        
      execute(sql)
      execute('COMMIT')

      execute('BEGIN TRANSACTION') 
      puts "populating capabilities with secure File Assets"
      sql = 
        "INSERT INTO capabilities (
          capability_type_id,
          capability_resource_type,
          capability_resource_id,
          scope_type_id
        )
        SELECT
          c.capability_type_id AS capability_type_id,
          'FileAsset' AS capability_resource_type,
          cm.capable_model_record_id AS capability_resource_id,
          #{instance.id} AS scope_type_id
        FROM capable_models AS cm
        JOIN capabilities_capable_models AS ccm ON ccm.capable_model_id = cm.id
        JOIN capabilities AS c ON ccm.capability_id = c.id
        JOIN secured_models AS sm ON sm.secured_record_id = c.id AND sm.secured_record_type = 'Capability'
        JOIN roles_secured_models AS rsm ON rsm.secured_model_id = sm.id
        JOIN security_roles AS r ON r.id = rsm.role_id
        WHERE cm.capable_model_record_type = 'FileAsset'"
        
      execute(sql)
      execute('COMMIT')

      view = CapabilityType.find_by_internal_identifier('view')

      execute('BEGIN TRANSACTION') 
      puts "populating capabilities with secure Website Sections"
      sql = 
        "INSERT INTO capabilities (
          capability_type_id,
          capability_resource_type,
          capability_resource_id,
          scope_type_id
        )
        SELECT
          #{view.id} AS capability_type_id,
          'WebsiteSection' AS capability_resource_type,
          ws.id AS capability_resource_id,
          #{instance.id} AS scope_type_id
        FROM secured_models sm 
        JOIN roles_secured_models rsm ON sm.id=rsm.secured_model_id
        JOIN website_sections ws ON sm.secured_record_id=ws.id
        WHERE sm.secured_record_type='WebsiteSection'"
        
      execute(sql)
      execute('COMMIT')

      execute('BEGIN TRANSACTION') 
      puts "populating capabilities with secure Website Nav Items"
      sql = 
        "INSERT INTO capabilities (
          capability_type_id,
          capability_resource_type,
          capability_resource_id,
          scope_type_id
        )
        SELECT
          #{view.id} AS capability_type_id,
          'WebsiteNavItem' AS capability_resource_type,
          ws.id AS capability_resource_id,
          #{instance.id} AS scope_type_id
        FROM secured_models sm 
        JOIN roles_secured_models rsm ON sm.id=rsm.secured_model_id
        JOIN website_sections ws ON sm.secured_record_id=ws.id
        WHERE sm.secured_record_type='WebsiteNavItem'"
        
      execute(sql)
      execute('COMMIT')

      # delete obsolete records: Application, Widget, dupes?
      Capability.where("capability_resource_type IS NULL").delete_all

      admin = SecurityRole.find_by_internal_identifier('admin')
      website_author = SecurityRole.find_by_internal_identifier('website_author')
      layout_author = SecurityRole.find_by_internal_identifier('layout_author')
      content_author = SecurityRole.find_by_internal_identifier('content_author')
      designer = SecurityRole.find_by_internal_identifier('designer')
      publisher = SecurityRole.find_by_internal_identifier('publisher')

      # add instance capabilities to roles
      instance_capabilities = Capability.where(:scope_type_id => instance.id).all
      instance_capabilities.each do |c|
        case c.capability_resource_type
        when 'FileAsset'
          admin.add_capability(c)
          website_author.add_capability(c)
          content_author.add_capability(c)
          if c.capability_resource.file_asset_holder_type == 'Website'
            website_role = c.capability_resource.file_asset_holder.role
            website_role.add_capability(c)
          end
        when 'WebsiteSection'
          admin.add_capability(c)
          website_author.add_capability(c)
          website_role = c.capability_resource.website.role
          website_role.add_capability(c)
        when 'WebsiteNavItem'
          admin.add_capability(c)
          website_author.add_capability(c)
          website_role = c.capability_resource.website_nav.website.role
          website_role.add_capability(c)
        end
      end

      # add knitkit class capabilities to roles
      admin.add_capability('create', 'WebsiteNav')
      admin.add_capability('delete', 'WebsiteNav')
      admin.add_capability('edit', 'WebsiteNav')

      website_author.add_capability('create', 'WebsiteNav')
      website_author.add_capability('delete', 'WebsiteNav')
      website_author.add_capability('edit', 'WebsiteNav')

      admin.add_capability('create', 'Website')
      admin.add_capability('delete', 'Website')
      admin.add_capability('edit', 'Website')
      admin.add_capability('import', 'Website')
      admin.add_capability('publish', 'Website')
      admin.add_capability('activate', 'Website')

      website_author.add_capability('create', 'Website')
      website_author.add_capability('delete', 'Website')
      website_author.add_capability('edit', 'Website')
      website_author.add_capability('import', 'Website')
      publisher.add_capability('publish', 'Website')
      publisher.add_capability('activate', 'Website')

      admin.add_capability('create', 'WebsiteHost')
      admin.add_capability('delete', 'WebsiteHost')
      admin.add_capability('edit', 'WebsiteHost')

      website_author.add_capability('create', 'WebsiteHost')
      website_author.add_capability('delete', 'WebsiteHost')
      website_author.add_capability('edit', 'WebsiteHost')

      admin.add_capability('create', 'WebsiteSection')
      admin.add_capability('delete', 'WebsiteSection')
      admin.add_capability('edit', 'WebsiteSection')
      admin.add_capability('secure', 'WebsiteSection')
      admin.add_capability('unsecure', 'WebsiteSection')

      website_author.add_capability('create', 'WebsiteSection')
      website_author.add_capability('delete', 'WebsiteSection')
      website_author.add_capability('edit', 'WebsiteSection')
      website_author.add_capability('secure', 'WebsiteSection')
      website_author.add_capability('unsecure', 'WebsiteSection')

      admin.add_capability('create', 'WebsiteSectionLayout')
      admin.add_capability('edit', 'WebsiteSectionLayout')

      layout_author.add_capability('create', 'WebsiteSectionLayout')
      layout_author.add_capability('edit', 'WebsiteSectionLayout')

      admin.add_capability('create', 'Content')
      admin.add_capability('delete', 'Content')
      admin.add_capability('edit', 'Content')
      admin.add_capability('publish', 'Content')
      admin.add_capability('revert_version', 'Content')
      admin.add_capability('add_existing', 'Content')
      admin.add_capability('edit_html', 'Content')
      admin.add_capability('edit_excerpt', 'Content')

      content_author.add_capability('create', 'Content')
      content_author.add_capability('delete', 'Content')
      content_author.add_capability('edit', 'Content')
      content_author.add_capability('publish', 'Content')
      content_author.add_capability('revert_version', 'Content')
      content_author.add_capability('add_existing', 'Content')
      content_author.add_capability('edit_html', 'Content')
      content_author.add_capability('edit_excerpt', 'Content')

      admin.add_capability('create', 'WebsiteNavItem')
      admin.add_capability('delete', 'WebsiteNavItem')
      admin.add_capability('edit', 'WebsiteNavItem')
      admin.add_capability('secure', 'WebsiteNavItem')
      admin.add_capability('unsecure', 'WebsiteNavItem')

      website_author.add_capability('create', 'WebsiteNavItem')
      website_author.add_capability('delete', 'WebsiteNavItem')
      website_author.add_capability('edit', 'WebsiteNavItem')
      website_author.add_capability('secure', 'WebsiteNavItem')
      website_author.add_capability('unsecure', 'WebsiteNavItem')

      admin.add_capability('view', 'Theme')
      designer.add_capability('view', 'Theme')

      admin.add_capability('view', 'SiteImageAsset')
      website_author.add_capability('view', 'SiteImageAsset')
      content_author.add_capability('view', 'SiteImageAsset')

      content_author.add_capability('view', 'GlobalImageAsset')

      admin.add_capability('view', 'GlobalImageAsset')
      admin.add_capability('upload', 'GlobalImageAsset')
      admin.add_capability('delete', 'GlobalImageAsset')

      website_author.add_capability('view', 'GlobalImageAsset')
      website_author.add_capability('upload', 'GlobalImageAsset')
      website_author.add_capability('delete', 'GlobalImageAsset')

      admin.add_capability('view', 'SiteFileAsset')
      website_author.add_capability('view', 'SiteFileAsset')
      content_author.add_capability('view', 'SiteFileAsset')

      content_author.add_capability('view', 'GlobalFileAsset')

      admin.add_capability('view', 'GlobalFileAsset')
      admin.add_capability('upload', 'GlobalFileAsset')
      admin.add_capability('delete', 'GlobalFileAsset')

      website_author.add_capability('view', 'GlobalFileAsset')
      website_author.add_capability('upload', 'GlobalFileAsset')
      website_author.add_capability('delete', 'GlobalFileAsset')

      admin.add_capability('drag_item', 'WebsiteTree')
      website_author.add_capability('drag_item', 'WebsiteTree')

      # update capability descriptions
      Capability.all.each do |c|
        c.update_description
      end

      drop_table :capable_models
      drop_table :capabilities_capable_models
      drop_table :secured_models
      drop_table :roles_secured_models
      remove_column :capabilities, :resource
    end
  end

  def self.down
  end
end
