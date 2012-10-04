namespace :compass_ae do

  desc "Upgrade you installation of Compass AE"
  task :upgrade => :environment do
    begin
      ActiveRecord::Migrator.prepare_upgrade_migrations
      RussellEdge::DataMigrator.prepare_upgrade_migrations

      Rake::Task["db:migrate"].reenable
      Rake::Task["db:migrate"].invoke

      Rake::Task["db:migrate_data"].reenable
      Rake::Task["db:migrate_data"].invoke

      ActiveRecord::Migrator.cleanup_upgrade_migrations
      RussellEdge::DataMigrator.cleanup_upgrade_migrations
    rescue Exception=>ex
      ActiveRecord::Migrator.cleanup_migrations
      ActiveRecord::Migrator.cleanup_upgrade_migrations
      RussellEdge::DataMigrator.cleanup_upgrade_migrations

      puts ex.inspect
      puts ex.backtrace
    end
  end

end
