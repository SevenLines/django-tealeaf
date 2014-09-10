module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main_script: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jquery.cookie/jquery.cookie.js',
                    'bower_components/jquery-form/jquery.form.js',
                    'templates/static/lib/bootstrap/bootstrap.min.js',
                    'templates/static/lib/logger.js',
                    'templates/static/js/interface.js',
                ],
                dest: 'templates/static/main.js'
            },
            marks_script: {
                src: [
                    'templates/static/lib/jquery.pickmeup.min.js',
                    'templates/static/lib/jquery.pickmeup.twitter-bootstrap.min.js',
                    'templates/static/lib/jquery.qtip.min.js',
                    'templates/static/lib/knockout.js',
                    'templates/static/lib/color.js',
//                    'templates/static/js/ko.modal_confirm.js',
//                    'students/static/js/students/ko.marks.js'
                ],
                dest: 'students/static/js/students/marks.js'
            }
        },
        uglify: {
            main_script: {
                src: 'templates/static/main.js',
                dest: 'templates/static/main.min.js'
            },
            marks_script: {
                src: 'students/static/js/students/marks.js',
                dest: 'students/static/js/students/marks.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('main_script', ['concat:main_script', 'uglify:main_script']);
    grunt.registerTask('marks_script', ['concat:marks_script', 'uglify:marks_script']);
};