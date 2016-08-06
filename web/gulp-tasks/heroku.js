/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);

/* Main tasks */

gulp.task('heroku', [], function() {
    return gulp.src('heroku/**/{*,.*}')
        .pipe(gulp.dest('dist/'));
});
