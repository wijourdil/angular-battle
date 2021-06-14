var gulp = require('gulp');
var _sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var _browserify = require('browserify');
var source = require('vinyl-source-stream');

// gulp serve
function serve() {
    connect.server({
        root: 'public',
        port: 4000
    });
}

// gulp cards
function cards() {
    return gulp.src(['./app/cards/*.js'])
        .pipe(concat('cards.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
}

// gulp engine
function engine() {
    return gulp.src(['./app/engine/*.js'])
        .pipe(concat('engine.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
}

// gulp sass
function sass() {
    return gulp.src('sass/style.scss')
        .pipe(_sass().on('error', _sass.logError))
        .pipe(gulp.dest('public/css'));
}

// gulp browserify
function browserify() {
    // TODO Minify public/main.js file
    // Grabs the app.js file
    return _browserify('./app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
}

// gulp watch
// -> gulp browserify && gulp sass
function watch() {
    gulp.watch('app/**/*.js', browserify());
    // Watches for changes in style.sass and runs the sass task
    gulp.watch('sass/style.scss', sass());
    // Watch other JS modification
    gulp.watch('app/cards/*', cards());
    gulp.watch('app/engine/*', engine());
}

// gulp
// -> gulp serve && gulp watch
var build = gulp.series(serve, watch);

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.serve = serve;
exports.cards = cards;
exports.engine = engine;
exports.sass = sass;
exports.browserify = browserify;
exports.watch = watch;

/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
