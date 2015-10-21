// gulpFile.js
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    shell = require('gulp-shell'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    glob = require('glob');

gulp.task('browserify', function (cb) {
  glob('./app/**/*.js', {}, function (err, files) {
    var b = browserify();
    files.forEach(function (file) {
      b.add(file);
    });
    b.bundle()
      .pipe(source('output.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist'));
    cb();
  }); 
});



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