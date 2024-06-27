require 'autoprefixer-rails'

# Configulations
Encoding.default_external = "utf-8"
http_path 			= "/"
css_dir 			= "../../dist/css"
sass_dir 			= "/"
# images_dir 			= "../../img"
# javascripts_dir 	= "../../inc/js"
# fonts_dir 			= "../../css/fonts"
line_comments 		= false
relative_assets 	= true
output_style 		= :compressed  #:nested, :expanded, :compact, or :compressed
# sass_options = { :debug_info => true }
cache				= false
asset_cache_buster :none

# Functions
on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    io << AutoprefixerRails.process(css, browsers:["last 2 version", "ie 9"])
  end
end