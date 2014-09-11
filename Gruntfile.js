module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main_style: {
                src: [
                    'templates/static/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'templates/static/bower_components/qtip2/qtip.min.css',
                    'templates/static/bower_components/pickmeup/pickmeup.min.css',
                ],
                dest: 'templates/static/main.css'
            },
            main_script: {
                src: [
                    'templates/static/bower_components/jquery/dist/jquery.min.js',
                    'templates/static/bower_components/jquery.cookie/jquery.cookie.js',
                    'templates/static/bower_components/jquery-form/jquery.form.js',
                    'templates/static/bower_components/qtip2/basic/jquery.qtip.min.js',
                    'templates/static/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'templates/static/bower_components/pickmeup/js/jquery.pickmeup.min.js',
                    'templates/static/bower_components/pickmeup/js/jquery.pickmeup.twitter-bootstrap.min.js',
                    'templates/static/lib/logger.js',
                    'templates/static/js/interface.js',
                    'templates/static/lib/color.js',
                ],
                dest: 'templates/static/main.js'
            },
        },
        uglify: {
            main_style: {
                src: 'templates/static/main.css',
                dest: 'templates/static/main.min.css'
            },
            main_script: {
                src: 'templates/static/main.js',
                dest: 'templates/static/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('deploy', 'deploying task', function () {
        grunt.task.run(['concat:main_script', 'uglify:main_script']);
        grunt.task.run(['concat:marks_script', 'uglify:marks_script']);
        grunt.task.run(['concat:main_style']);
    });
};