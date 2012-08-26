class CreateTickets < ActiveRecord::Migration

  def up
    unless table_exists?(:tickets)
      create_table :tickets do |t|
        t.timestamps
      end
    end

  end

  def down
    if table_exists?(:tickets)
      drop_table :tickets
    end
  end

end
