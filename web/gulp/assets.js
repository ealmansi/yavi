'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('assets', [], function() {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{png,jpg,jpeg,bmp,gif}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.src, '/assets/images/vendor/')));
});
