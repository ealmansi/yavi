/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');

/* Scripts tasks */

gulp.task('scripts', ['scripts-app', 'scripts-vendor']);

gulp.task('scripts-app', [], function() {
    return gulp.src('src/**/*.js')
            .pipe(plugins.flatten())
            .pipe(plugins.eslint())
            .pipe(plugins.eslint.format())
            .pipe(plugins.concat('app.min.js'))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/scripts/'))
            .on('error', plugins.util.log);
});

gulp.task('scripts-vendor', [], function() {
    return gulp.src(mainBowerFiles())
            .pipe(plugins.filter("**/*.js"))
            .pipe(plugins.flatten())
            .pipe(plugins.concat('vendor.min.js'))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/scripts/'))
            .on('error', plugins.util.log);
});
