var merge = require('merge-stream');

module.exports = function (gulp, $, paths) {
  return function () {
    return merge(
      gulp.src(paths)
        .pipe(require('./inject-svg')())
        .pipe($.htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          //removeOptionalTags: true
        }))
        .pipe(gulp.dest('dist')),
      gulp.src([
        'app/**/robots.txt',
        'app/**/sitemap.xml'
      ], {
          nodir: true
        })
        .pipe(gulp.dest('dist'))
    );
  }
}
