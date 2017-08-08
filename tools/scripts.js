module.exports = function (gulp, $, paths) {
  return function () {
    return gulp.src(paths.scripts)
      .pipe($.webpack({
        output: {
          filename: 'bundle.js'
        },
        module: {
          rules: [
            {
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['env']
                }
              }
            }
          ]
        }
      }))
      .pipe(gulp.dest('dist'));
  }
}
