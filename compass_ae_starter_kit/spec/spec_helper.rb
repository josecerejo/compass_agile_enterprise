require 'spork'
require 'rake'

Spork.prefork do

end

Spork.each_run do
  require 'simplecov'
  SimpleCov.start 'rails' do
    add_filter "spec/"
  end
  #Need to explictly load the files in lib/ until we figure out how to
  #get rails to autoload them for spec like it used to...
  Dir[File.join(ENGINE_RAILS_ROOT, "lib/**/*.rb")].each {|f| load f}
end
