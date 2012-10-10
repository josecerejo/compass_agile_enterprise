class AddQueueToDelayedJobs < ActiveRecord::Migration
  def self.up
    unless column_exists?(:delayed_jobs, :queue)
      add_column :delayed_jobs, :queue, :string
    end
  end

  def self.down
    if column_exists?(:delayed_jobs, :queue)
      remove_column :delayed_jobs, :queue
    end
  end
end
