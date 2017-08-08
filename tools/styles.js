module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths.styles)
      .pipe($.sass({
        precision: 10,
        includePaths: ['node_modules']
      }))
      .on('error', $.util.log)
      .pipe($.concat('bundle.css'))
      .pipe(gulp.dest('dist'));
  }
}
