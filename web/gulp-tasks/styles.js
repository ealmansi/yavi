/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files');
var merge = require('merge2');
var handleError = require('./handle-error');

/* Styles tasks */

gulp.task('styles', ['styles-app', 'styles-vendor']);

gulp.task('styles-app', [], function() {
    return gulp.src('src/**/*.scss')
        .pipe(plugins.newer('dist/styles/app.min.css'))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.concat('app.min.css'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.cleanCss({compatibility: 'ie8', processImport: false}).on('error', handleError))
        .pipe(plugins.sourcemaps.write('../maps/'))
        .pipe(gulp.dest('dist/styles/'))
        .on('error', handleError);
});

gulp.task('styles-vendor', [], function() {
    var mainBowerStream =
        gulp.src(mainBowerFiles())
            .pipe(plugins.filter(["**/*.{css,scss}", "!**/_bootstrap.scss"]));

    var bootstrapStream =
        gulp.src(mainBowerFiles())
            .pipe(plugins.filter("**/_bootstrap.scss"))
            .pipe(plugins.rename(function(path) { path.basename = 'bootstrap'; }));

    return merge(mainBowerStream, bootstrapStream)
        .pipe(plugins.newer('dist/styles/vendor.min.css'))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.concat('vendor.min.css'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.cleanCss({compatibility: 'ie8', processImport: false}).on('error', handleError))
        .pipe(plugins.sourcemaps.write('../maps/'))
        .pipe(gulp.dest('dist/styles/'))
        .on('error', handleError);
});
