var merge = require('merge-stream');

module.exports = function (gulp, $) {
  return function () {
    return merge(
      // html
      gulp.src('dist/**/*.html')
        .pipe($.htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('dist')),
      // scripts
      gulp.src('dist/bundle.js')
      .pipe($.uglify())
      .pipe(gulp.dest('dist')),
      // styles
      gulp.src('dist/bundle.css')
      .pipe($.postcss([
        require('autoprefixer')({
          browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
          ]
        }),
        require('postcss-flexbugs-fixes'),
        require('cssnano')
      ]))
      .pipe(gulp.dest('dist')),
      // images
      gulp.src('dist/images/**/*')
      .pipe($.imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('dist/images'))
    );
  }
}
