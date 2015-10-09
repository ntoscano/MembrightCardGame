// gulpFile.js
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    shell = require('gulp-shell');

gulp.task('test', function() {
  return gulp.src('app/controllers/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'Testing done.' }));
});

gulp.task('images', function() {
  return gulp.src('app/assets/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('app/assets/'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('start', function() {
  return gulp.src('app')
    .pipe(shell('python -m SimpleHTTPServer 8000'))
});


gulp.task('default', [], function() {
    gulp.start('test', 'start');
});