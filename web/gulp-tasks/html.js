/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);

/* Html tasks */

gulp.task('html', ['html-index', 'html-other']);

gulp.task('html-index', [], function() {
    return gulp.src('src/index.html')
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.htmlmin({collapseWhitespace: true}))
            .pipe(plugins.sourcemaps.write('maps/'))
            .pipe(gulp.dest('dist/'))
            .on('error', plugins.util.log);
});

gulp.task('html-other', [], function() {
    return gulp.src(['src/**/*.html', '!src/index.html'])
            .pipe(plugins.flatten())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.htmlmin({collapseWhitespace: true}))
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/html/'))
            .on('error', plugins.util.log);
});
