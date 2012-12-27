class Report < ActiveRecord::Base
  validates :name, :internal_identifier, :uniqueness => true

  before_create :set_default_template

  def set_default_template
    self.template =
"<h3><%= title %></h3>

<table>
  <tr>
  <% columns.each do |column| %>
    <th><%= column %></th>
  <% end %>
  </tr>
  <% rows.each do |row| %>
    <tr>
    <% row.values.each do |value| %>
	 <td><%= value %></td>
    <% end %>
    </tr>
  <% end %>
</table>

<%= report_download_link(unique_name, :csv, 'Download CSV') %> |
<%= report_download_link(unique_name, :pdf, 'Download PDF') %>"
  end
end