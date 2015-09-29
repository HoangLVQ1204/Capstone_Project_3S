/**
 * Created by hoanglvq on 9/22/15.
 */
/* Import LIBS */
var sync    = require('run-sequence');
var browser = require('browser-sync');
var webpack = require('webpack-stream');
var path    = require('path');
var rimraf  = require('rimraf');
var yargs   = require('yargs').argv;
var gulp    = require('gulp');
var $       = require('gulp-load-plugins')({lazy:false});

var build_env = (process.env.NODE_ENV === 'production' ? 'compress_and_build' : 'build');

/* Define PATHS */
var paths = {
    entry: 'app/app.js',
    app: 'app/**/*.{js,css,html}',
    js: 'app/**/*!(.spec.js).js',
    toCopy: 'app/index.html',
    dest: 'dist'
};

/* Define HELPER FUNCTION */

/* Define GULP TASK */

gulp.task('cleanDist', function(cb) {
    rimraf('./dist', cb);
});

gulp.task('cleanJS',function(cb){
    rimraf('./dist/*.js*', cb);
});

gulp.task('todo', function() {
    return gulp.src(paths.js)
        .pipe($.todoist({silent: false, verbose: true}));
});

gulp.task('build',['todo','cleanJS'], function() {
    var webpackConfig = require('./webpack.config');
    delete webpackConfig.output.path;
    return gulp.src(paths.entry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('compress_and_build', ['build'], function() {
    return gulp.src('dist/*.js')
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe($.rename(function(path){
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
    browser({
        port: process.env.PORT || 4500,
        open: false,
        ghostMode: false,
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('copy', function() {
    return gulp.src(paths.toCopy, { base: 'app' })
        .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
    gulp.watch(paths.app, [build_env, browser.reload]);
    gulp.watch(paths.toCopy, ['copy', browser.reload]);
});

gulp.task('default', $.sequence('cleanDist',build_env,'copy','serve','watch'));