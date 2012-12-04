namespace :db do
  namespace :migrate do

    desc "list pending migrations"
    task :list_pending => :environment do
      pending_migrations = ActiveRecord::Migrator.new('up', 'db/migrate/').pending_migrations.collect{|item| File.basename(item.filename)}
      puts "================Pending Migrations=========="
      puts pending_migrations
      puts "============================================"
    end

  end#migrate
end#db

namespace :compass_ae do
  namespace :install do
    desc "Install all CompassAE migrations"
    task :migrations => :environment do
      Rails.application.config.erp_base_erp_svcs.compass_ae_engines.each do |e|
        if e.has_migrations?
          puts "Coping migrations from #{e.name}"
          task = "#{e.name.split("::").first.underscore}:install:migrations"
          Rake::Task["railties:install:migrations"].reenable
          Rake::Task[task].invoke
        end
      end
    end
    
    desc "Install all CompassAE data migrations"
    task :data_migrations => :environment do
      Rails.application.config.erp_base_erp_svcs.compass_ae_engines.each do |e|
        if e.has_data_migrations?
          puts "Coping data migrations from #{e.name}"
          task = "#{e.name.split("::").first.underscore}:install:data_migrations"
          Rake::Task["railties:install:data_migrations"].reenable
          Rake::Task[task].invoke
        end
      end
    end
    
  end

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
    rescue Exception => ex
      ActiveRecord::Migrator.cleanup_migrations
      ActiveRecord::Migrator.cleanup_upgrade_migrations
      RussellEdge::DataMigrator.cleanup_upgrade_migrations

      puts ex.inspect
      puts ex.backtrace
    end
  end #install
end #compass_ae