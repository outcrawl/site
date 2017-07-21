module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths)
      .pipe($.babel())
      .pipe($.uglify())
      .pipe($.concat('main.js'))
      .pipe(gulp.dest('dist'));
  }
}
