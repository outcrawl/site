var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();
$.del = require('del');

var paths = {
  styles: [
    'app/vendor/**/*.css',
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ],
  scripts: [
    'app/vendor/**/*.js',
    'app/scripts/**/*.js'
  ],
  images: [
    'app/images/**/*'
  ],
  html: [
    'app/**/*.html'
  ]
};

gulp.task('clean', function () {
  return $.del(['app', 'dist/*']);
});

gulp.task('scripts', require('./tools/scripts')(gulp, $, paths.scripts));
gulp.task('styles', require('./tools/styles')(gulp, $, paths.styles));
gulp.task('images', require('./tools/images')(gulp, $, paths.images));
gulp.task('html', require('./tools/html')(gulp, $, paths.html));

// Build Hugo site
gulp.task('hugo', $.shell.task('hugo --buildDrafts --destination=../app', { cwd: 'site' }));

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    'hugo',
    'images',
    ['html', 'styles', 'scripts'],
    cb);
});

gulp.task('build:dev', ['hugo'], function () {
  return merge(
    gulp.src(paths.styles)
      .pipe($.sass({ precision: 10 }))
      .pipe($.concat('main.css'))
      .pipe(gulp.dest('dist')),
    gulp.src(paths.scripts)
      .pipe($.babel())
      .pipe($.concat('main.js'))
      .pipe(gulp.dest('dist')),
    gulp.src(paths.html)
      .pipe(gulp.dest('dist'))
  );
});

gulp.task('serve', ['build:dev'], function () {
  browserSync({
    notify: false,
    server: 'dist',
    port: 3000
  });
  gulp.watch(['site/**/*'], ['build:dev', browserSync.reload]);
});

gulp.task('default', ['build']);
