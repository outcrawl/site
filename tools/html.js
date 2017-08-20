var merge = require('merge-stream');
var replace = require('gulp-replace');
var hljs = require('highlight.js');
var katex = require('katex');
var fs = require('fs');

// https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
function escapeHTML(html) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return String(html).replace(/[&<>"'`=\/]/g, function(s) {
    return entityMap[s];
  });
}

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
    var copyBtn = '<button class="mdl-button mdl-js-button mdl-button--icon" title="Copy" style="z-index:1;"' +
      'data-clipboard-text="' + escapeHTML(sourceCode) + '">\n' +
      '<img class="icon" src="/images/icons/content-copy.svg">\n' +
      '</button>';

    pres[i].innerHTML = copyBtn + '<code class="hljs">' + html + '</code>';
  }
  return this;
}

function anchors() {
  var h = this.querySelectorAll('h1[id], h2[id]');
  var permalink = this.querySelector('link[rel="canonical"]');

  for (var i = 0; i < h.length; i++) {
    var id = h[i].getAttribute('id');
    h[i].outerHTML = '<a class="page__heading-link" href="' + permalink.href + '#' + id + '">' + h[i].outerHTML + '</a>';
  }

  return this;
}

function insertLatex() {
  var tags = this.querySelectorAll('.latex--inline');
  for (var i = 0; i < tags.length; i++) {
    tags[i].innerHTML = katex.renderToString(tags[i].innerHTML, {
      displayMode: false
    });
  }
  tags = this.querySelectorAll('.latex--block')
  for (var i = 0; i < tags.length; i++) {
    tags[i].innerHTML = katex.renderToString(tags[i].innerHTML, {
      displayMode: true
    });
  }
  return this;
}

function injectSvg() {
  var imgs = this.querySelectorAll('img[src$="svg"]');
  for (var i = 0; i < imgs.length; i++) {
    var src = imgs[i].src;
    var svg = fs.readFileSync('dist/images/icons/' + src.replace(/.*\//, ''), 'utf8').replace(/\r?\n|\r/g, '');
    var attrs = '';

    for (var j = 0; j < imgs[i].attributes.length; j++) {
      var a = imgs[i].attributes[j];
      if (a.name != 'src') {
        attrs += a.name + '="' + a.value + '"';
      }
    }

    imgs[i].outerHTML = svg.replace('<svg ', '<svg ' + attrs);
  }
  return this;
}

module.exports = function(gulp, $, paths) {
  return function() {
    return merge(
      gulp.src(paths.html)
      .pipe($.dom(highlight))
      .pipe($.dom(anchors))
      .pipe($.dom(insertLatex))
      .pipe($.dom(injectSvg))
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
