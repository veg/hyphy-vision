var gulp = require('gulp'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    watch = require('gulp-watch'),
    react = require('gulp-react');

gulp.task('scripts', function() {
    return gulp.src(['src/**/*.js'])
    .pipe(order([
      "datamonkey/datamonkey.js",
      "datamonkey/*.js",
      "busted/busted.js",
      "**/*.js"
    ]))
    .pipe(concat('hyphy-vision.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('react', function () {
    return gulp.src('./src/jsx/relax/omega_plots.jsx')
        .pipe(react())
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['scripts', 'react']);

gulp.task('watch', function () {
    watch('src/**/*', function () {
        gulp.start('build');
    }); 
});

gulp.task('default', function () {
    gulp.start('build');
});
