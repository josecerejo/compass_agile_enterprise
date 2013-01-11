ActiveRecord::Migration.class_eval do
  def copy(destination, sources, options = {})
    copied = []

    FileUtils.mkdir_p(destination) unless File.exists?(destination)

    destination_migrations = ActiveRecord::Migrator.migrations(destination)
    last = destination_migrations.last
    sources.each do |scope, path|
      source_migrations = ActiveRecord::Migrator.migrations(path)

      source_migrations.each do |migration|
        source = File.read(migration.filename)
        source = "# This migration comes from #{scope} (originally #{migration.version})\n#{source}"
        
        if duplicate = destination_migrations.detect { |m| m.name == migration.name }
          if options[:refresh] && duplicate.scope == scope.to_s
            Dir.glob(File.join(destination,"*_#{migration.name.underscore}.#{scope.to_s}.rb")).each { |f| puts "Removing old migration #{migration.name}"; File.delete(f) }
          elsif options[:on_skip] && duplicate.scope != scope.to_s
            options[:on_skip].call(scope, migration)
          end
          next unless options[:refresh]
        end
        
        migration.version = next_migration_number(last ? last.version + 1 : 0).to_i unless options[:preserve_timestamp]
        new_path = File.join(destination, "#{migration.version}_#{migration.name.underscore}.#{scope}.rb")
        old_path, migration.filename = migration.filename, new_path
        last = migration
        
        File.open(migration.filename, "w") { |f| f.write source }
        copied << migration
        options[:on_copy].call(scope, migration, old_path) if options[:on_copy]
        destination_migrations << migration
      end
    end

    copied
  end
end