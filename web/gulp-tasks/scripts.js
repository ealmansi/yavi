/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');
var handleError = require('./handle-error');

/* Scripts tasks */

gulp.task('scripts', ['scripts-config', 'scripts-app', 'scripts-vendor']);

gulp.task('scripts-config', [], function() {
    return gulp.src('src/config.js')
        .pipe(plugins.newer('dist/scripts/config.min.js'))
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.concat('config.min.js'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('../maps/'))
        .pipe(gulp.dest('dist/scripts/'))
        .on('error', handleError);
});

gulp.task('scripts-app', [], function() {
    return gulp.src('src/**/*.js')
        .pipe(plugins.newer('dist/scripts/app.min.js'))
        .pipe(plugins.angularFilesort().on('error', handleError))
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.ngAnnotate().on('error', handleError))
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('../maps/'))
        .pipe(gulp.dest('dist/scripts/'))
        .on('error', handleError);
});

gulp.task('scripts-vendor', [], function() {
    return gulp.src(mainBowerFiles())
        .pipe(plugins.newer('dist/scripts/vendor.min.js'))
        .pipe(plugins.filter("**/*.js"))
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('../maps/'))
        .pipe(gulp.dest('dist/scripts/'))
        .on('error', handleError);
});
