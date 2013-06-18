class AddNeptuneThemePreference
  
  def self.up
    neptune_extjs_theme = PreferenceOption.where(:internal_identifier => 'neptune_extjs_theme').first
    if neptune_extjs_theme.nil?

      #add neptune themes
      neptune_extjs_theme = PreferenceOption.create(:description => 'Neptune', :internal_identifier => 'neptune_extjs_theme', :value => 'extjs:ext-all-neptune')

      extjs_theme_pt = PreferenceType.find_by_internal_identifier('extjs_theme')
      extjs_theme_pt.preference_options << neptune_extjs_theme
      extjs_theme_pt.save
    end
  end
  
  def self.down
    #remove data here
  end

end
