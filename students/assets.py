from django_assets import Bundle, register
from django_assets.env import get_env
from webassets import Environment

get_env().append_path('templates/static')
get_env().append_path("students/static")

marks_js = Bundle('bower_components/knockout/dist/knockout.js',
                 'js/ko.modal_confirm.js',
                 'js/students/ko.marks.js',
                 filters="yui_js",
                 output="gen/js/students/marks.min.js")

register("marks_js", marks_js)
