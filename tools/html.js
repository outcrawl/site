module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths)
      .pipe(require('./inject-svg'))
      .pipe($.htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true
      }))
      .pipe(gulp.dest('dist'));
  }
}
