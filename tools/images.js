var merge = require('merge-stream');

module.exports = function(gulp, $, paths) {
  return function() {
    return merge(
      gulp.src(`${paths.images}/**/*`, {
        nodir: true
      })
      .pipe(gulp.dest('dist/images')),
      gulp.src(`${paths.images}/**/*.jpg`, {
        nodir: true
      })
      .pipe($.imageResize({
        width: 50,
        upscale: false
      }))
      .pipe($.rename({
        prefix: 'small-'
      }))
      .pipe(gulp.dest('dist/images'))
    );
  }
}
