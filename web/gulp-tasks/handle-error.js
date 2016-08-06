/* Imports */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);

/* Avoid killing watch on error. */

function handleError(err) {
    plugins.util.log(err);
    this.emit('end');
}

module.exports = handleError;
