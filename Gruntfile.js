module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main_style: {
                src: [
                    'templates/static/lib/bootstrap/bootstrap.min.css',
                    'templates/static/bower_components/qtip2/jquery.qtip.min.css',
                    'templates/static/bower_components/pickmeup/pickmeup.min.css',
                    'templates/static/css/style.css'
                ],
                dest: 'templates/static/css/main.css'
            },
            main_script: {
                src: [
                    'templates/static/bower_components/jquery/dist/jquery.min.js',
                    'templates/static/bower_components/jquery.cookie/jquery.cookie.js',
                    'templates/static/bower_components/jquery-form/jquery.form.js',
                    'templates/static/bower_components/qtip2/basic/jquery.qtip.min.js',
                    'templates/static/bower_components/pickmeup/js/jquery.pickmeup.min.js',
                    'templates/static/bower_components/pickmeup/js/jquery.pickmeup.twitter-bootstrap.min.js',
                    'templates/static/lib/bootstrap/bootstrap.min.js',
                    'templates/static/lib/logger.js',
                    'templates/static/js/interface.js',
                    'templates/static/lib/color.js',
                ],
                dest: 'templates/static/js/main.js'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            main_style: {
                files: [{
                    src: 'templates/static/css/main.css',
                    dest: 'templates/static/css/main.min.css'
                }]
            }
        },
        uglify: {
            main_script: {
                src: 'templates/static/js/main.js',
                dest: 'templates/static/js/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('deploy', 'deploying task', function () {
        grunt.task.run(['concat:main_script', 'uglify:main_script']);
//        grunt.task.run(['concat:marks_script', 'uglify:marks_script']);
        grunt.task.run(['concat:main_style', "cssmin:main_style"]);
    });
};