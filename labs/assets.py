from django_assets import Bundle, register
from django_assets.env import get_env
from webassets import Environment

get_env().append_path('templates/static')
get_env().append_path("labs/static")

labs_js = Bundle(
    'bower_components/jstree/dist/jstree.min.js',
    'bower_components/knockout/dist/knockout.js',
    'bower_components/select2/select2.min.js',
    'js/ko.ckeditor.js',
    'js/ko.select2.js',
    'js/ko.modal_confirm.js',
    'js/labscontrol/labscontrol.js',
    filters="yui_js",
    output="js/labscontrol/labscontrol.min.js")

register("labs_js", labs_js)
