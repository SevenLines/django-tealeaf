from django_assets import Bundle, register

marks_js = Bundle('templates/static/bower_components/knockout/dist/knockout.js',
                 'templates/static/js/ko.modal_confirm.js',
                 'students/static/js/students/ko.marks.js',
                 filters="yui_js",
                 output="students/static/js/students/marks.min.js")

register("marks_js", marks_js)
