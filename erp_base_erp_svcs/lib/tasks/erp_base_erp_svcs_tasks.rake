require 'fileutils'

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
      compass_ae_railties = Rails.application.config.erp_base_erp_svcs.compass_ae_engines.collect{|e| "#{e.name.split("::").first.underscore}"}.join(',')
      task = "railties:install:migrations"
      ENV['FROM'] = compass_ae_railties
      Rake::Task[task].invoke
    end #migrations
    
    desc "Install all CompassAE data migrations"
    task :data_migrations => :environment do
      compass_ae_railties = Rails.application.config.erp_base_erp_svcs.compass_ae_engines.collect{|e| "#{e.name.split("::").first.underscore}"}.join(',')
      task = "railties:install:data_migrations"
      ENV['FROM'] = compass_ae_railties
      Rake::Task[task].invoke
    end #data_migrations
  end #install

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
    end #handle exceptions
  end #upgrade
end #compass_ae