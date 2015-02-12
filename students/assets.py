from django_assets import Bundle, register
from webassets.filter import register_filter, ExternalTool
from django_assets.env import get_env
from webassets.filter import Filter
from webassets.filter.requirejs import RequireJSFilter

get_env().append_path("students/static")
#
# class MyFilter(ExternalTool):
#     name = 'myfilter'
#     options = {
#         'module': 'MODULE',
#     }
#
#     argv = ['r.js', '-o', '{source}']
#     method = 'open'
#
#
# register_filter(MyFilter)
# f = RequireJSFilter()
# f.baseUrl = "js/students/marks"
# f.config = "/students/static/js/students/marks/build.js"


# marks_js = Bundle('js/students/marks/build.js',
#                  filters=RequireJSFilter(**{'modname': 'marks'}),
#                  output="js/students/marks-built.js")
#
# register("marks_js", marks_js)
#
