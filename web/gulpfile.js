/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var del = require('del');
var runSequence = require('run-sequence');
require('require-dir')('gulp-tasks/');

/* Main tasks */

gulp.task('build', ['html', 'scripts', 'styles', 'assets', 'fonts', 'heroku']);

gulp.task('serve', ['build'], function() {
    return runSequence('browser-sync-init', 'browser-sync-watch');
});

gulp.task('clean', [], function() {
    return del(['dist/**/{*,.*}', '!dist/.git']);
});

gulp.task('default', [], function() {
    return runSequence('clean', 'build');
});
