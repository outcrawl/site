var merge = require('merge-stream');
var replace = require('gulp-replace');
var hljs = require('highlight.js');

function markLines(html, mark) {
  if (!mark) {
    return html;
  }

  var htmlLines = html.split('\n');
  var lines = mark.split(',');

  for (var i = 0; i < htmlLines.length; i++) {
    var doMark = false;

    for (var j = 0; j < lines.length; j++) {
      if (lines[j].indexOf('-') != -1) {
        var range = lines[j].split('-');
        if ((i + 1) >= +range[0] && (i + 1) <= +range[1]) {
          doMark = true;
          break;
        }
      } else {
        if ((i + 1) == +lines[j]) {
          doMark = true;
          break;
        }
      }
    }

    if (doMark) {
      htmlLines[i] = '<mark class="highlight-line">' + htmlLines[i] + '</mark>';
    }
  }

  return htmlLines.join('\n');
}

function highlight() {
  var pres = this.querySelectorAll('pre');
  for (var i = 0; i < pres.length; i++) {
    var codeNode = pres[i].firstChild;
    var sourceCode = codeNode.textContent;
    var lang = codeNode.getAttribute('class').replace('language-', '');

    var mark = pres[i].getAttribute('data-mark');
    pres[i].removeAttribute('data-mark');

    var html = markLines(hljs.highlight(lang, sourceCode).value, mark);

    pres[i].innerHTML = '<code class="hljs">' + html + '</code>';
  }
  return this;
}

function anchors() {
  var h = this.querySelectorAll('h1[id], h2[id]');
  var permalink = this.querySelector('link[rel="canonical"]');

  for (var i = 0; i < h.length; i++) {
    var id = h[i].getAttribute('id');
    h[i].outerHTML = '<a class="post__heading-link" href="' + permalink.href + '#' + id + '">' + h[i].outerHTML + '</a>';
  }

  return this;
}

module.exports = function (gulp, $, paths) {
  return function () {
    return merge(
      gulp.src(paths.html)
        .pipe($.dom(highlight))
        .pipe($.dom(anchors))
        .pipe(require('./inject-svg')())
        .pipe(gulp.dest('dist')),
      gulp.src([
        'app/**/robots.txt',
        'app/**/sitemap.xml'
      ], {
          nodir: true
        })
        .pipe(gulp.dest('dist'))
    );
  }
}
