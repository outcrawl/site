var merge = require('merge-stream');

module.exports = function (gulp, $, paths) {
  return function () {
    return merge(
      gulp.src(paths.html)
        .pipe(require('./inject-svg')())
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
