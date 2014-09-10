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
            }
        },
        uglify: {
            main_script: {
                src: 'templates/static/main.js',
                dest: 'templates/static/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('main_script', ['concat:main_script', 'uglify:main_script']);
};