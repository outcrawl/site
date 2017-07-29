var runSequence = require('run-sequence');
var fs = require('fs');
var del = require('del');

module.exports = function (gulp, $) {
  return function () {
    gulp.task('generate-favicons', function() {
      if (fs.existsSync('dist/.favicons.html')) {
        return null;
      }

      return gulp.src('app/images/logo.svg')
        .pipe($.favicons({
          appName: "Outcrawl",
          appDescription: "Software development tutorials without nonsense",
          developerName: "Tin Rabzelj",
          developerURL: "https://outcrawl.com/",
          background: "#FFFFFF",
          path: "/",
          url: "https://outcrawl.com/",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          version: 1.0,
          logging: false,
          online: false,
          html: ".favicons.html",
          pipeHTML: true,
          replace: true
        }))
        .pipe(gulp.dest('dist'));
    });

    gulp.task('inject-favicons', function() {
      return gulp.src([
        'dist/**/*.html',
        '!dist/.favicons.html'
      ])
      .pipe($.replace(/<\/head>/, function(h) {
        var file = fs.readFileSync('dist/.favicons.html', 'utf8');
        return file + '</head>';
      }))
      .pipe(gulp.dest('dist'));
    });

    return runSequence('generate-favicons', 'inject-favicons');
  }
}
