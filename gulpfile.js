var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var print = require('gulp-print');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

var sourcePaths = {
    styles: ['src/styles/*.scss'],
    js: ['src/js/*.js'],
    views: ['src/*.html']
};

var distPaths = {
    main: 'dist/',
    styles: 'dist/styles/',
    js: 'dist/js/',
    lib: 'dist/lib',
};

var server = {
    host: 'localhost',
    port: '3333'
};

gulp.task('sass', function() {
    gulp.src(sourcePaths.styles, {base: 'src'})
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(distPaths.main));
});

gulp.task('babel', function() {
    return gulp.src(sourcePaths.js, {base: 'src'})
        .pipe(print())
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(distPaths.main));
});

gulp.task('libs', function(){
    return gulp.src([
        'node_modules/systemjs/dist/system.js',
        'node_modules/babel-polyfill/dist/polyfill.js'])
        .pipe(print())
        .pipe(gulp.dest(distPaths.lib));
});

gulp.task('webserver', function() {
    gulp.src('dist/')
        .pipe(webserver({
            host: server.host,
            port: server.port,
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('build', ['sass', 'babel', 'libs'], function() {
    return gulp.src(['src/*.html'])
        .pipe(print())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(sourcePaths.styles, ['sass']);
    gulp.watch(sourcePaths.js, ['babel']);
    gulp.watch(sourcePaths.views);
});

gulp.task('default', [
    'build',
    'webserver',
    'watch'
]);
