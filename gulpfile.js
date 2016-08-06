var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var opn = require('opn');
var responsive = require('gulp-responsive');
var babel = require('gulp-babel');

var sourcePaths = {
    styles: ['styles/*.scss', 'resume/styles/*.scss', 'game/styles/*.scss'],
	js: ['**/js/*.js'],
    views: ['**/*.html']
};

var distPaths = {
    styles: './',
    js: './'
};

var server = {
    host: 'localhost',
    port: '3333'
};

gulp.task('sass', function() {
    gulp.src(sourcePaths.styles, {base: './src/'})
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(distPaths.styles));
});

gulp.task('babel', function() {
    return gulp.src(sourcePaths.js)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(sourcePaths.js));
});

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            host: server.host,
            port: server.port,
            livereload: true,
            directoryListing: false
        }));
});

gulp.task('openbrowser', function() {
    opn('http://' + server.host + ':' + server.port);
});

gulp.task('watch', function() {
    gulp.watch(sourcePaths.styles, ['sass']);
	gulp.watch(sourcePaths.js);
    gulp.watch(sourcePaths.views);
});

gulp.task('build', ['sass']);

gulp.task('default', [
   'build',
    'webserver',
    'watch',
   'openbrowser'
]);
