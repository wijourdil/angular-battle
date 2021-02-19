var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// gulp go
gulp.task('go', function () {
    connect.server({
        root: 'public',
        port: 4000
    });
});

// gulp cards
gulp.task('cards', function(){
    return gulp.src([ './app/cards/*.js' ])
        .pipe(concat('cards.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

// gulp engine
gulp.task('engine', function(){
    return gulp.src([ './app/engine/*.js' ])
        .pipe(concat('engine.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

// gulp sass
gulp.task('sass', function() {
    return sass('sass/style.scss')
        .pipe(gulp.dest('public/css'))
});

// gulp browserify
gulp.task('browserify', function() {
    // TODO Minify public/main.js file
    // Grabs the app.js file
    return browserify('./app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
});

// gulp watch
// -> gulp browserify && gulp sass
gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['browserify']);
    // Watches for changes in style.sass and runs the sass task
    gulp.watch('sass/style.scss', ['sass']);
    // Watch other JS modification
    gulp.watch('app/cards/*', ['cards']);
    gulp.watch('app/engine/*', ['engine']);
});

// gulp
// -> gulp go && gulp watch
gulp.task('default', ['go', 'watch']);
