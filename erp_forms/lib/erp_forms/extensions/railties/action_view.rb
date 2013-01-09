ActionView::Base.class_eval do

  # name is ClassName of form you want
  # options are optional
  # options = {
  #   :internal_identifier => 'iid of exact form you want' (a model can have multiple forms)
  #   :width => 'width of form in pixels'
  # }
  def render_dynamic_form(name, options={})
    output = raw '&nbsp<script type="text/javascript">Ext.onReady(function() {'
    output += raw "Compass.ErpApp.Utility.JsLoader.load(['/javascripts/erp_app/shared/dynamic_forms/dynamic_form_fields.js'], function(){"

    output += raw DynamicForm.get_form(name.to_s, options[:internal_identifier]).to_extjs_widget(
                { :url => build_widget_url(:new),
                  :widget_result_id => widget_result_id,
                  :width => options[:width] 
                })

    output += raw '}); });</script>'
    output
  end
  
end