module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths.styles)
      .pipe($.sass({
        precision: 10
      }))
      .pipe($.concat('main.css'))
      .pipe(gulp.dest('dist'));
  }
}
