/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

/* Browser-sync tasks */

gulp.task('browser-sync-init', function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('browser-sync-watch', function() {
    gulp.watch('src/index.html').on('change', function() {
        runSequence('html-index', 'browser-sync-reload');
    });
    gulp.watch(['src/**/*.html', '!src/index.html']).on('change', function() {
        runSequence('html-other', 'browser-sync-reload');
    });
    gulp.watch('src/**/*.js').on('change', function() {
        runSequence('scripts-app', 'browser-sync-reload');
    });
    gulp.watch('src/**/*.{scss,sass}').on('change', function() {
        runSequence('styles-app', 'browser-sync-reload');
    });
});

gulp.task('browser-sync-reload', function() {
    browserSync.reload();
});
