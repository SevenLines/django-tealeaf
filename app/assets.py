from django_assets import Bundle, register
from django_assets.env import get_env

get_env().append_path("app/static")

# # main_js = Bundle('bower_components/jquery/dist/jquery.min.js',
# #                  'bower_components/jquery.cookie/jquery.cookie.js',
# #                  'bower_components/jquery-form/jquery.form.js',
# #                  'bower_components/qtip2/basic/jquery.qtip.min.js',
# #                  'bower_components/pickmeup/js/jquery.pickmeup.min.js',
# #                  'bower_components/pickmeup/js/jquery.pickmeup.twitter-bootstrap.min.js',
# #                  'bower_components/underscore/underscore.js',
#                  # 'bower_components/Sortable/Sortable.min.js',
#                  # 'lib/bootstrap/bootstrap.min.js',
#                  # 'lib/logger.js',
#                  # 'js/interface.js',
#                  # 'lib/_color.js',
#                  # filters="yui_js",
#                  # output="js/main.min.js")
#
# main_js = Bundle('bower_components/jquery/dist/jquery.min.js',
#                  # 'bower_components/requirejs/require.js',
#                  filters="yui_js",
#                  output="js/main.min.js")

main_css = Bundle('lib/bootstrap/bootstrap.min.css',
                  'bower_components/qtip2/jquery.qtip.min.css',
                  'bower_components/pickmeup/css/pickmeup.min.css',
                  'css/style.css',
                  filters="cssmin",
                  output="css/main.min.css")

# register("main_js", main_js)
register("main_css", main_css)
