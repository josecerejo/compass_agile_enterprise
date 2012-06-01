class AddDomainToCategories < ActiveRecord::Migration
  def change
    unless columns(:categories).collect {|c| c.name}.include?('domain')
      add_column :categories, :domain, :string
      add_index  :categories, :domain, :name => "category_domain"
    end
  end
end
