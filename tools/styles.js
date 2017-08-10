var merge = require('merge-stream');

module.exports = function (gulp, $, paths) {
  return function () {
    return merge(
      gulp.src(paths.styles)
        .pipe($.sass({
          precision: 10,
          includePaths: ['node_modules']
        }))
        .on('error', $.util.log)
        .pipe($.concat('bundle.css'))
        .pipe(gulp.dest('dist')),
      gulp.src('node_modules/katex/dist/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
    );
  }
}
