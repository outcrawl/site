const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const merge = require('merge-stream');
const $ = require('gulp-load-plugins')();
$.del = require('del');

const paths = {
  styles: [
    'app/styles/main.scss'
  ],
  scripts: [
    'app/scripts/_main.js'
  ],
  images: [
    'app/images'
  ],
  html: [
    'app/**/*.html'
  ]
};

gulp.task('clean', function() {
  return $.del(['app', 'dist/*', 'dist/.favicons.html']);
});

gulp.task('scripts', require('./tools/scripts')(gulp, $, paths));
gulp.task('styles', require('./tools/styles')(gulp, $, paths));
gulp.task('images', require('./tools/images')(gulp, $, paths));
gulp.task('html', require('./tools/html')(gulp, $, paths));
gulp.task('favicons', require('./tools/favicons')(gulp, $));
gulp.task('minify', require('./tools/minify')(gulp, $, paths));

// Build Hugo site
gulp.task('hugo', $.shell.task('hugo --baseURL=https://outcrawl.com/ --destination=../app', {
  cwd: 'site'
}));
gulp.task('hugo:dev', $.shell.task('hugo --baseURL=http://localhost:3000/ --buildDrafts --destination=../app', {
  cwd: 'site'
}));

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    'hugo',
    'images',
    'html', ['favicons', 'styles', 'scripts'],
    'minify',
    cb);
});

gulp.task('build:dev', function(cb) {
  runSequence(
    'hugo:dev',
    'images',
    'html', ['favicons', 'styles', 'scripts'],
    cb);
});

gulp.task('serve', ['build:dev'], function() {
  browserSync({
    notify: false,
    server: 'dist',
    port: 3000
  });
  gulp.watch(['site/**/*'], ['build:dev', browserSync.reload]);
});

gulp.task('default', ['build']);
