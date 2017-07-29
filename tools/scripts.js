module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths.scripts)
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.concat('main.js'))
      .pipe(gulp.dest('dist'));
  }
}
