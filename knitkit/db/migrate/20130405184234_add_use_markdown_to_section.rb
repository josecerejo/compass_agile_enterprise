class AddUseMarkdownToSection < ActiveRecord::Migration
  def self.up
    unless columns(:website_sections).collect {|c| c.name}.include?('use_markdown')
      add_column :website_sections, :use_markdown, :boolean

      WebsiteSection.all.each do |section|
        section.use_markdown = false
        section.save
      end

    end
  end

  def self.down
    if columns(:website_sections).collect {|c| c.name}.include?('use_markdown')
      remove_column :website_sections, :use_markdown
    end
  end
end
