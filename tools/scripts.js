module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths)
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.uglify())
      .pipe($.concat('main.js'))
      .pipe(gulp.dest('dist'));
  }
}
