var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

gulp.task('sass', function () {
    gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(minifycss())
        .pipe(gulp.dest('app/static/css'))
});

gulp.task('default', [
    'sass'
]);