class CreateGroups < ActiveRecord::Migration
  def self.up
    unless table_exists?(:groups)
      create_table :groups do |t|
        t.column :description, :string
        t.timestamps
      end
    end
  end

  def self.down
    [ :groups ].each do |tbl|
      if table_exists?(tbl)
        drop_table tbl
      end
    end
  end
end
