require 'action_controller'
require 'sunspot/rails/tasks'

namespace :sunspot do
  task :reindex_dynamic_form_models => :environment do
    if use_solr?
      DynamicFormModel.order('id asc').all.each do |m|
        next if m.model_name == 'DynamicFormDocument'
        if m.get_constant.respond_to?(:solr_reindex)
          m.get_constant.sunspot_setup
          puts "Indexing #{m.model_name} ..."
          m.get_constant.solr_reindex
          puts "Done."
        end
      end
    end
  end

  task :delete_dynamic_form_models => :environment do
    if use_solr?
      DynamicFormModel.all.each do |m|
        next if m.model_name == 'DynamicFormDocument'
        if m.get_constant.respond_to?(:solr_reindex)
          m.get_constant.sunspot_setup
          puts "Removing Indexes for #{m.model_name} ..."
          m.get_constant.solr_remove_all_from_index!
          puts "Done."
        end
      end
    end
  end


  def use_solr?
    if $USE_SOLR_FOR_DYNAMIC_FORM_MODELS
      return true
    else
      puts "USE_SOLR_FOR_DYNAMIC_FORM_MODELS is off. You likely need to install erp_search."
      return false
    end
  end
end