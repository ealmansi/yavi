/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var runSequence = require('run-sequence');
require('require-dir')('gulp-tasks/');

/* Main tasks */

gulp.task('build', ['html', 'scripts', 'styles', 'heroku'], function() {
  /* empty */
});

gulp.task('serve', ['build'], function() {
  return runSequence('browser-sync-init', 'browser-sync-watch');
});

gulp.task('clean', [], function() {
  return gulp.src(['dist/**/{*,.*}', '!dist/.git'], {read: false})
            .pipe(plugins.clean());
});

gulp.task('default', [], function() {
  return runSequence('clean', 'build');
});
