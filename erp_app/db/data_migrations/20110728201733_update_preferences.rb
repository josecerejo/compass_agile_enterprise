class UpdatePreferences
  
  def self.up

    truenorth_logo_po = PreferenceOption.where(:internal_identifier => 'truenorth_logo_background').first
    if(truenorth_logo_po.value == 'truenorth.png')
      #update background
      truenorth_logo_po.value = 'truenorth_tech.png'
      truenorth_logo_po.save

      #remove backgrounds
      %w{grey_gradient_desktop_background purple_desktop_background planet_desktop_background portablemind_desktop_background}.each do |background_iid|
        pref_opt = PreferenceOption.find_by_internal_identifier(background_iid)
        pref_opt.destroy unless pref_opt.nil?
      end

      #update themes
      pref_opt = PreferenceOption.find_by_internal_identifier('access_extjs_theme')
      pref_opt.value = 'extjs:ext-all-access'
      pref_opt.save

      pref_opt = PreferenceOption.find_by_internal_identifier('gray_extjs_theme')
      pref_opt.value = 'extjs:ext-all-gray'
      pref_opt.save

      pref_opt = PreferenceOption.find_by_internal_identifier('blue_extjs_theme')
      pref_opt.value = 'extjs:ext-all'
      pref_opt.save

      #add new themes
      clifton_extjs_theme_po = PreferenceOption.create(:description => 'Clifton Default', :internal_identifier => 'clifton_extjs_theme', :value => 'clifton:clifton')
      clifton_extjs_theme_green_po = PreferenceOption.create(:description => 'Clifton Green', :internal_identifier => 'clifton_extjs_theme', :value => 'clifton:clifton-green')
      clifton_extjs_theme_yellow_po = PreferenceOption.create(:description => 'Clifton Yellow', :internal_identifier => 'clifton_extjs_theme', :value => 'clifton:clifton-yellow')
      clifton_extjs_theme_pink_po = PreferenceOption.create(:description => 'Clifton Pink', :internal_identifier => 'clifton_extjs_theme', :value => 'clifton:clifton-pink')
      clifton_extjs_theme_blue_po = PreferenceOption.create(:description => 'Clifton Blue', :internal_identifier => 'clifton_extjs_theme', :value => 'clifton:clifton-blue')

      extjs_theme_pt = PreferenceType.find_by_internal_identifier('extjs_theme')
      extjs_theme_pt.preference_options << clifton_extjs_theme_po
      extjs_theme_pt.preference_options << clifton_extjs_theme_green_po
      extjs_theme_pt.preference_options << clifton_extjs_theme_yellow_po
      extjs_theme_pt.preference_options << clifton_extjs_theme_pink_po
      extjs_theme_pt.preference_options << clifton_extjs_theme_blue_po
      extjs_theme_pt.save
    end

  end
  
  def self.down
    #remove data here
  end

end
