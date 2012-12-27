class AddReports < ActiveRecord::Migration
  def up
    unless table_exists? :reports
      create_table :reports do |t|
        t.string :name
        t.string :internal_identifier
        t.text   :template
        t.text   :query

        t.timestamps
      end
    end
  end

  def down
    if table.exists? :reports
      drop_table :reports
    end
  end
end
