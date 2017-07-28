var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var merge = require('merge-stream');
var injectSvg = require('./tools/inject-svg');
var $ = require('gulp-load-plugins')();
$.del = require('del');

var paths = {
  styles: [
    'app/vendor/bootstrap.css',
    'app/vendor/prism.css',

    'app/styles/bootstrap.scss',
    'app/styles/theme.scss',
    'app/styles/styles.scss',
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ],
  scripts: [
    'app/vendor/bootstrap.js',
    'app/vendor/prism.js',
    'app/vendor/wade.js',

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
  return $.del(['app', 'dist/*', 'dist/.favicons.html']);
});

gulp.task('scripts', require('./tools/scripts')(gulp, $, paths.scripts));
gulp.task('styles', require('./tools/styles')(gulp, $, paths.styles));
gulp.task('images', require('./tools/images')(gulp, $, paths.images));
gulp.task('html', require('./tools/html')(gulp, $, paths.html));
gulp.task('favicons', require('./tools/favicons')(gulp, $));

// Build Hugo site
gulp.task('hugo', $.shell.task('hugo --destination=../app', { cwd: 'site' }));

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    'hugo',
    'images',
    'html',
    ['favicons', 'styles', 'scripts'],
    cb);
});

// dev tasks
gulp.task('images:dev', function () {
  return gulp.src(paths.images, {
    nodir: true
  })
    .pipe(gulp.dest('dist/images'));
});

gulp.task('styles:dev', function () {
  return gulp.src(paths.styles)
    .pipe($.sass({ precision: 10 }))
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:dev', function () {
  return gulp.src(paths.scripts)
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('html:dev', function () {
  return merge(
    gulp.src(paths.html)
      .pipe(injectSvg())
      .pipe(gulp.dest('dist')),
    gulp.src([
      'app/**/robots.txt',
      'app/**/sitemap.xml'
    ], {
        nodir: true
      })
      .pipe(gulp.dest('dist'))
  );
});

gulp.task('build:dev', ['hugo'], function () {
  return runSequence(
    'images:dev',
    'html:dev',
    ['styles:dev', 'scripts:dev', 'favicons']
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
