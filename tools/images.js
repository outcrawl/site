module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths, {
      nodir: true
    })
      .pipe($.imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('dist/images'));
  }
}
