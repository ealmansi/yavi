'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var debug = require('gulp-debug');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('flags', [], function() {
  return gulp.src('bower_components/flag-icon-css/flags/**/*.svg')
      .pipe(gulp.dest(path.join(conf.paths.src, '/flags/')))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/flags/')));
});

gulp.task('amcharts-images', [], function() {
  return gulp.src('bower_components/amcharts3/amcharts/images/**/*')
      .pipe(gulp.dest(path.join(conf.paths.src, '/assets/images/amcharts/images/')));
});

gulp.task('clean-assets', [], function() {
  return $.del([
    path.join(conf.paths.src, '/flags/'),
    path.join(conf.paths.dist, '/flags/'),
    path.join(conf.paths.src, '/assets/images/amcharts/')
  ]);
});

gulp.task('assets', ['flags', 'amcharts-images']);
