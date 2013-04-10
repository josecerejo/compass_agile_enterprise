# $ext_path: This should be the path of the Ext JS SDK relative to this file
$ext_path = "../../"

# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
# Generally this will be in a resources/sass folder
# <root>/resources/sass
sass_path = File.dirname(__FILE__)

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
# <root>/resources/css
css_path = File.join(sass_path, "..", "css")

images_path = File.join(sass_path, "..", "themes", "images")
generated_images_dir = File.join(sass_path, "..", "themes", "images")
generated_images_path = File.join(sass_path, "..", "themes", "images")
http_generated_images_path = File.join("..", "themes", "images")
sprite_load_path = File.join(sass_path, "..", "themes", "images")

# output_style: The output style for your compiled CSS
# nested, expanded, compact, compressed
# More information can be found here http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
output_style = :compressed

# We need to load in the Ext4 themes folder, which includes all it's default styling, images, variables and mixins
load File.join(File.dirname(__FILE__), $ext_path, 'resources', 'themes')
