class SetupKnitkitCapabilities
  
  def self.up
      admin = SecurityRole.find_by_internal_identifier('admin')
      website_author = SecurityRole.find_by_internal_identifier('website_author')
      layout_author = SecurityRole.find_by_internal_identifier('layout_author')
      content_author = SecurityRole.find_by_internal_identifier('content_author')
      designer = SecurityRole.find_by_internal_identifier('designer')
      publisher = SecurityRole.find_by_internal_identifier('publisher')

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
  end
  
  def self.down
  end

end
