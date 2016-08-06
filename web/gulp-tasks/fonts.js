/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');
var handleError = require('./handle-error');

/* Fonts tasks */

gulp.task('fonts', ['fonts-app', 'fonts-vendor']);

gulp.task('fonts-app', [], function() {
    return gulp.src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(plugins.flatten())
        .pipe(gulp.dest('dist/fonts/'))
        .on('error', handleError);
});

gulp.task('fonts-vendor', ['fonts-bootstrap']);

gulp.task('fonts-bootstrap', [], function() {
    return gulp.src(mainBowerFiles({ group: 'bootstrap' }))
        .pipe(plugins.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe(plugins.flatten())
        .pipe(gulp.dest('dist/fonts/bootstrap/'))
        .on('error', handleError);
});
