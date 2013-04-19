module Knitkit
  class OnlineDocumentSectionsController < BaseController
    layout 'knitkit/online_document_sections'

    before_filter :find_root
    before_filter :find_document_sections, :only => :build_tree

    def index

    end

    def build_tree
      render :inline => build_document_hash.to_json
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

    def id_or_node
      (params[:node].to_i == 0) ? params[:section_id] : params[:node]
    end

    def find_root
      @root = OnlineDocumentSection.find(params[:section_id])
    end

    def find_document_sections
      @document_sections = OnlineDocumentSection.find(id_or_node).positioned_children
    end

    def build_document_hash
      [].tap do |documents|
        @document_sections.each do |section|
          documents << {:id => section.id,
                        :title => section.title,
                        :leaf => section.leaf,
                        :iconCls => (section.leaf ? 'icon-documentation-document' : 'icon-documentation-multi-document')}
        end
      end
    end

  end
end