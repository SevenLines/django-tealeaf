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

students_manager_js = Bundle("js/helpers.js",
                             "bower_components/lodash/lodash.min.js",
                             "bower_components/angular/angular.js",
                             "bower_components/angular-route/angular-route.js",
                             "bower_components/angular-animate/angular-animate.js",
                             "js/students/manager/app.js",
                             "js/students/manager/controllers/group.js",
                             "js/students/manager/controllers/groups.js",
                             "js/students/manager/controllers/years.js",
                             "js/students/manager/models/_base.js",
                             "js/students/manager/models/student.js",
                             "js/students/manager/models/group.js",
                             filters="jsmin",
                             output="js/students/manager/dist/app.js")

main_css = Bundle('lib/bootstrap/bootstrap.min.css',
                  'bower_components/qtip2/jquery.qtip.min.css',
                  'bower_components/pickmeup/css/pickmeup.min.css',
                  'bower_components/fontawesome-iconpicker/dist/css/fontawesome-iconpicker.css',
                  'css/style.css',
                  filters="cssmin",
                  output="css/main.min.css")

register("base-js", base_js)
register("students_manager_js", students_manager_js)
register("main_css", main_css)
