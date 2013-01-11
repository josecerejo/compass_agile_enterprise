require 'fileutils'

#redefine copy engine migrations rake task
Rake::Task["railties:install:migrations"].clear

namespace :railties do
  namespace :install do
    # desc "Copies missing migrations from Railties (e.g. plugins, engines). You can specify Railties to use with FROM=railtie1,railtie2"
    task :migrations => :'db:load_config' do
      to_load = ENV['FROM'].blank? ? :all : ENV['FROM'].split(",").map {|n| n.strip }
      #added to allow developer to perserve timestamps
      preserve_timestamp = ENV['PRESERVE_TIMESTAMPS'].blank? ? false : (ENV['PRESERVE_TIMESTAMPS'].to_s.downcase == "true")
      #refresh will replace migrations from engines
      refresh = ENV['REFRESH'].blank? ? false : (ENV['REFRESH'].to_s.downcase == "true")
      railties = ActiveSupport::OrderedHash.new
      Rails.application.railties.all do |railtie|
        next unless to_load == :all || to_load.include?(railtie.railtie_name)

        if railtie.respond_to?(:paths) && (path = railtie.paths['db/migrate'].first)
          railties[railtie.railtie_name] = path
        end
      end

      on_skip = Proc.new do |name, migration|
        puts "NOTE: Migration #{migration.basename} from #{name} has been skipped. Migration with the same name already exists."
      end

      on_copy = Proc.new do |name, migration, old_path|
        puts "Copied migration #{migration.basename} from #{name}"
      end

      ActiveRecord::Migration.copy(ActiveRecord::Migrator.migrations_paths.first, railties,
                                    :on_skip => on_skip, :on_copy => on_copy, :preserve_timestamp => preserve_timestamp, :refresh => refresh)
    end
  end
end

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
    desc "Install all CompassAE schema migrations"
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