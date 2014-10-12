from django_assets import Bundle, register

main_js = Bundle('templates/static/bower_components/jquery/dist/jquery.min.js',
                 'templates/static/bower_components/jquery.cookie/jquery.cookie.js',
                 'templates/static/bower_components/jquery-form/jquery.form.js',
                 'templates/static/bower_components/qtip2/basic/jquery.qtip.min.js',
                 'templates/static/bower_components/pickmeup/js/jquery.pickmeup.min.js',
                 'templates/static/bower_components/pickmeup/js/jquery.pickmeup.twitter-bootstrap.min.js',
                 'templates/static/lib/bootstrap/bootstrap.min.js',
                 'templates/static/lib/logger.js',
                 'templates/static/js/interface.js',
                 'templates/static/lib/color.js',
                 filters="yui_js",
                 output="templates/static/js/main.min.js")

main_css = Bundle('templates/static/lib/bootstrap/bootstrap.min.css',
                  'templates/static/bower_components/qtip2/jquery.qtip.min.css',
                  'templates/static/bower_components/pickmeup/css/pickmeup.min.css',
                  'templates/static/css/style.css',
                  filters="cssmin",
                  output="templates/static/css/main.min.css")

register("main_js", main_js)
register("main_css", main_css)
