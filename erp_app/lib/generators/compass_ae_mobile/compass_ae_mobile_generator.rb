class CompassAeMobileGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)
  argument :sdk_path, :type => :string
  
  def generate_sencha_touch_application
    javascripts_path = File.join(Rails.root, 'public', 'javascripts')
    application_path = File.join(javascripts_path, class_name)
    
    empty_directory(javascripts_path)
    run "sencha -sdk #{@sdk_path} generate app #{class_name} #{application_path}"
    
    %w{app.json build.xml index.html packager.json resources}.each do |file|
      remove_file(File.join(application_path, file))
    end
    
    gsub_file File.join(application_path, 'app.js'), %r[^//<debug>([\s\S])+//</debug>], "Ext.Loader.setPath({'#{class_name}': 'javascripts/#{class_name}/app'});"
    
    #replace Main.js
    remove_file remove_file(File.join(application_path, 'app', 'view', 'Main.js'))
    template "javascripts/main_template.erb", File.join(application_path, 'app', 'view', 'Main.js')
  end
  
  def generate_compass_ae_files
    #controller
    template "controllers/controller_template.erb", File.join("app/controllers","#{file_name}_controller.rb")
    
    #view
    copy_file "views/view_template.erb", File.join("app/views/#{file_name}","index.html.erb")
    gsub_file File.join("app/views/#{file_name}","index.html.erb"), /CLASS_NAME_PLACE_HOLDER/, class_name
    
    #route
    route "match '/#{file_name}' => '#{file_name}#index'"
  end
  
end
