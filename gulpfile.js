var gulp = require('gulp');
var fs = require('fs')
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
  ]
};

var injectSvg = $.replace(/<img .*src="(.*svg)".*>/g, function (element, file) {
  // get size attributes
  var width = /width=\"([^"]*)\"/.exec(element);
  var height = /height=\"([^"]*)\"/.exec(element);

  // read svg file
  var svg = fs.readFileSync('dist' + file, 'utf8').replace(/\r?\n|\r/g, '');

  // inject attributes in svg element if they exist
  if (width) {
    svg = svg.replace(/<svg/, '<svg ' + width[0]);
  }
  if (height) {
    svg = svg.replace(/<svg/, '<svg ' + height[0]);
  }

  return svg;
});

gulp.task('clean', function () {
  return $.del(['app', 'dist']);
});

// Build Hugo site
gulp.task('hugo', $.shell.task('hugo --buildDrafts --destination=../app', { cwd: 'site' }));

// Optimize styles
gulp.task('styles', function () {
  return gulp.src(paths.styles)
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
});

// Optimize scripts
gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist'));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src(paths.images, {
    nodir: true
  })
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.ignore.include('**/*.png'))
    .pipe($.imageResize({ width: 50 }))
    .pipe($.rename({ prefix: 'small-' }))
    .pipe(gulp.dest('dist/images'));
});

// Optimize html
gulp.task('html', function () {
  return gulp.src(['app/**/*.html'])
    .pipe(injectSvg)
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    'hugo',
    ['html', 'images', 'scripts'],
    'styles',
    cb);
});

gulp.task('copy:assets', function () {
  var styles = gulp.src(paths.styles)
    .pipe($.sass({
      precision: 10
    }))
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('dist'));
  var scripts = gulp.src(paths.scripts)
    .pipe($.babel())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist'));
  var html = gulp.src(['app/**/*.html'])
    .pipe(injectSvg)
    .pipe(gulp.dest('dist'));

  return merge(styles, scripts, html);
});

gulp.task('build:dev', ['clean'], function (cb) {
  return runSequence('hugo', 'images', 'copy:assets', cb);
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
