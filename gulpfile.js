var gulp = require('gulp'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    react = require('gulp-react');

gulp.task('scripts', function() {
    return gulp.src(['src/**/*.js', 'jsx-compiled/*.js'])
    .pipe(order([
      "datamonkey/datamonkey.js",
      "datamonkey/*.js",
      "busted/busted.js",
      "**/*.js"
    ]))
    .pipe(sourcemaps.init())
      .pipe(concat('hyphy-vision.js'))
      .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('react', function () {
    return gulp.src(['src/jsx/*.jsx', 'src/jsx/components/*.jsx'])
        .pipe(react())
        .pipe(gulp.dest('./jsx-compiled/'));
});

gulp.task('build', ['react', 'scripts']);

gulp.task('watch', function () {
    watch(['src/**/*', 'src/jsx/components/*'], function () {
        gulp.start('build');
    }); 
});

gulp.task('default', function () {
    gulp.start('build');
});
