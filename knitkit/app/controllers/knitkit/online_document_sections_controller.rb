module Knitkit
  class OnlineDocumentSectionsController < BaseController
    include ActionView::Helpers::SanitizeHelper

    layout 'knitkit/online_document_sections'

    before_filter :find_root
    before_filter :find_document_sections, :only => :build_tree

    def index
      @online_document = OnlineDocumentSection.find(params[:section_id])
      @online_document = nil if @online_document.id == find_root.id
    end

    def search
      html = ''
      results = DocumentedContent.search({:query => params[:query].strip,
                                 :content_type => 'OnlineDocumentSection',
                                 :parent_id => params[:section_id],
                                 :website_id => @website.id})

      DocumentedContent.build_search_results(results).each do |result|
        html << "<p>
                  <a href=\"javascript:findShowAndExpandNode('#{result[:internal_identifier]}');\">#{result[:title]}</a>
                  <p>#{sanitize(result[:content].body_html[0..500])}...</p>
                </p>"
      end

      render :json => {:success => true, :html => html}
    end

    def build_tree
      render :json => @document_sections.collect { |document| build_document_hash(document) }
    end

    def get_content
      document_section = OnlineDocumentSection.find(params[:document_section_id])
      content = document_section.documented_item_published_content(@active_publication)
      if document_section.use_markdown and content
        html = Kramdown::Document.new(content.body_html).to_html
      else
        html = content ? content.body_html : ''
      end

      render :json => {:success => true, :html => html}
    end

    protected

    def find_root
      @root = OnlineDocumentSection.find(params[:section_id]).root
    end

    def find_document_sections
      @document_sections = find_root.positioned_children
    end

    def build_document_hash(document_section)
      {:id => document_section.internal_identifier,
       :title => document_section.title,
       :leaf => document_section.leaf,
       :iconCls => (document_section.leaf ? 'icon-documentation-document' : 'icon-documentation-multi-document'),
       :children => document_section.positioned_children.collect { |child_document_section| build_document_hash(child_document_section) }}
    end

  end
end