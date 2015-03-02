from django_assets import Bundle, register
from django_assets.env import get_env

get_env().append_path("app/static")


base_js = Bundle('bower_components/jquery/dist/jquery.js',
                 'bower_components/jquery.cookie/jquery.cookie.js',
                 'bower_components/google-code-prettify/bin/prettify.min.js',
                 'lib/bootstrap/bootstrap.min.js',
                 'js/jquery.toc.js',
                 'js/interface.js',
                 filters="yui_js",
                 output="js/dist/base.js")

main_css = Bundle('lib/bootstrap/bootstrap.min.css',
                  'bower_components/qtip2/jquery.qtip.min.css',
                  'bower_components/pickmeup/css/pickmeup.min.css',
                  'css/style.css',
                  filters="cssmin",
                  output="css/main.min.css")

register("base-js", base_js)
register("main_css", main_css)
