module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths.images, {
      nodir: true
    })
      .pipe(gulp.dest('dist/images'));
  }
}
