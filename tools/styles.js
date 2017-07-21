module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths)
      .pipe($.sass({
        precision: 10
      }))
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
      .pipe($.concat('main.css'))
      .pipe(gulp.dest('dist'));
  }
}
