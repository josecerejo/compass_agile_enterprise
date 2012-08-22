require 'spec_helper'

describe WebsiteSection do
  it "can be instantiated" do
    WebsiteSection.new.should be_an_instance_of(WebsiteSection)
  end

  it "can be saved successfully" do
    WebsiteSection.create(:title => "Some Title").should be_persisted
  end
end

describe WebsiteSection, "is_section? and is_document_section?" do
  let!(:website) { Factory.create(:website, :name => "Website")}
  let(:page) { Factory.create(:website_section,:website => website) }
  let(:blog) { Factory.create(:blog,:website => website) }
  let(:document) { Factory.create(:online_document_section,:website => website) }
  
  describe WebsiteSection, "is_section?" do
    it "should return true for the page" do
      page.is_section?.should be_true
    end

    it "should return true for the blog" do
      blog.is_section?.should be_true
    end

    it "should return false for the document" do
      document.is_section?.should be_false
    end
  end
  
  describe WebsiteSection, "is_document_section?" do  
    it "should return true for the page" do
      page.is_document_section?.should be_false
    end

    it "should return true for the blog" do
      blog.is_document_section?.should be_false
    end

    it "should return false for the document" do
      document.is_document_section?.should be_true
    end
  end
  
  
end


