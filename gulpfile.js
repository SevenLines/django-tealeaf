var gulp = require('gulp');
var karma = require('karma').server;
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

gulp.task('sass', function () {
	gulp.src('app/sass/*.scss')
		.pipe(sass())
		.pipe(minifycss())
		.pipe(gulp.dest('app/static/css'))
});


gulp.task('karma', function () {
	var config_array = [
		'/home/m/_WEB/Django/tealeaf/application/app/static/js/students/marks'
	];
	for (var i = 0; i < config_array.length; ++i) {
		karma.start({
			configFile: config_array[i] + '/karma.conf.js',
			singleRun: true
		});
	}
});

gulp.task('default', [
	'sass'
]);