/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files');

/* Styles tasks */

gulp.task('styles', ['styles-app', 'styles-vendor']);

gulp.task('styles-app', [], function() {
    return gulp.src('src/**/*.{scss,sass}')
            .pipe(plugins.flatten())
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(plugins.concat('app.min.css'))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.cleanCss({compatibility: 'ie8'}))
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/styles/'))
            .on('error', plugins.util.log);
});

gulp.task('styles-vendor', [], function() {
    return gulp.src(mainBowerFiles())
            .pipe(plugins.filter("**/*.{css,less}"))
            .pipe(plugins.flatten())
            .pipe(plugins.less())
            .pipe(plugins.concat('vendor.min.css'))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.cleanCss({compatibility: 'ie8'}))
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/styles/'))
            .on('error', plugins.util.log);
});
