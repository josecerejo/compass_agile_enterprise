class AddPublisherRole
  
  def self.up
    SecurityRole.create(:internal_identifier => 'publisher', :description => 'Publisher')
    SecurityRole.create(:internal_identifier => 'content_author', :description => 'Content Author')
    SecurityRole.create(:internal_identifier => 'layout_author', :description => 'Layout Author')
    SecurityRole.create(:internal_identifier => 'editor', :description => 'Editor')
    SecurityRole.create(:internal_identifier => 'designer', :description => 'Designer')
    SecurityRole.create(:internal_identifier => 'website_author', :description => 'Website Author')
  end
  
  def self.down
    SecurityRole.iid('publisher').destroy
    SecurityRole.iid('content_author').destroy
    SecurityRole.iid('layout_author').destroy
    SecurityRole.iid('editor').destroy
    SecurityRole.iid('designer').destroy
    SecurityRole.iid('website_author').destroy
  end

end
