/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var merge = require('merge2');
var handleError = require('./handle-error');

/* Html tasks */

gulp.task('html', [], function() {
    var indexStream =
        gulp.src('src/**/index.html');
    
    var othersStream =
        gulp.src(['src/**/*.html', '!src/**/index.html'])
            .pipe(plugins.rename(function(path) { path.dirname = 'html'; }));
    
    return merge(indexStream, othersStream)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(plugins.sourcemaps.write('maps/'))
        .pipe(gulp.dest('dist/'))
        .on('error', handleError);
});
