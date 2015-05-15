var gulp = require('gulp');
var karma = require('karma').server;
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

gulp.task('sass', function () {
	gulp.src('app/sass/*.scss')
		.pipe(sass())
		//.pipe(minifycss())
		.pipe(gulp.dest('app/static/css'))
});


gulp.task('karma', function () {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	});
});

gulp.task('default', [
	'sass'
]);