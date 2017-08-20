const merge = require('merge-stream');
const fs = require('fs');

const scriptsConfig = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  }
};

module.exports = (gulp, $, paths) => {
  return () => {
    return gulp.src(paths.scripts)
      .pipe($.webpack(scriptsConfig))
      .pipe(gulp.dest('dist'));
  };
}
