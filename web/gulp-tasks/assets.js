/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');
var handleError = require('./handle-error');

/* Assets tasks */

gulp.task('assets', ['favicon', 'assets-app']);

gulp.task('favicon', [], function() {
    return gulp.src('src/**/favicon.ico')
        .pipe(gulp.dest('dist/'))
        .on('error', handleError);
});

gulp.task('assets-app', [], function() {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets/'))
        .on('error', handleError);
});

gulp.task('assets-vendor', [], function() {
    return gulp.src(mainBowerFiles())
        .pipe(plugins.filter('**/*.{ttf,woff,woff2}'))
        .pipe(plugins.debug())
        .pipe(gulp.dest('dist/assets/fonts/'))
        .on('error', handleError);
});
