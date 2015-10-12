var gulp = require('gulp'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    watch = require('gulp-watch');

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

gulp.task('watch', function () {
    watch('src/**/*', function () {
        gulp.start('scripts');
    }); 
});
