/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var connectHistoryApiFallback = require('connect-history-api-fallback');
var handleError = require('./handle-error');

/* Browser-sync tasks */

gulp.task('browser-sync-init', function() {
    browserSync.init({
        server: {
            baseDir: "dist/",
            middleware: [ connectHistoryApiFallback() ]
        }
    });
});

gulp.task('browser-sync-watch', function() {
    gulp.watch('**/*.html', { cwd: 'src' }).on('change', function() {
        runSequence('html', 'browser-sync-reload');
    }).on('error', handleError);
    gulp.watch('**/*.js', { cwd: 'src' }).on('change', function() {
        runSequence('scripts-config', 'scripts-app', 'browser-sync-reload');
    }).on('error', handleError);
    gulp.watch('**/*.scss', { cwd: 'src' }).on('change', function() {
        runSequence('styles-app', 'browser-sync-reload');
    }).on('error', handleError);
    gulp.watch('assets/**/*', { cwd: 'src' }).on('change', function() {
        runSequence('assets', 'browser-sync-reload');
    }).on('error', handleError);
});

gulp.task('browser-sync-reload', function() {
    browserSync.reload();
});
