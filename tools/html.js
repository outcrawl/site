const merge = require('merge-stream');
const replace = require('gulp-replace');
const hljs = require('highlight.js');
const katex = require('katex');
const fs = require('fs');

// https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
function escapeHTML(html) {
  const entityMap = {
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

  const htmlLines = html.split('\n');
  const lines = mark.split(',');

  for (let i = 0; i < htmlLines.length; i++) {
    let doMark = false;

    for (let j = 0; j < lines.length; j++) {
      if (lines[j].indexOf('-') != -1) {
        const range = lines[j].split('-');
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
  const pres = this.querySelectorAll('pre');
  for (let i = 0; i < pres.length; i++) {
    const codeNode = pres[i].firstChild;
    const sourceCode = codeNode.textContent;
    const lang = codeNode.getAttribute('class').replace('language-', '');

    const mark = pres[i].getAttribute('data-mark');
    pres[i].removeAttribute('data-mark');

    const html = markLines(hljs.highlight(lang, sourceCode).value, mark);
    const copyBtn = `<button class="mdl-button mdl-js-button mdl-button--icon"
            title="Copy"
            style="z-index:1;"
            data-clipboard-text="${escapeHTML(sourceCode)}">
      <img class="icon" src="/images/icons/content-copy.svg">
    </button>`;

    pres[i].innerHTML = `${copyBtn}<code class="hljs">${html}</code>`;
  }
  return this;
}

function headingAnchors() {
  const h = this.querySelectorAll('.page__content post h1[id], .page__content post h2[id], .page__content post h3[id]');
  const permalink = this.querySelector('link[rel="canonical"]');

  for (let i = 0; i < h.length; i++) {
    const id = h[i].getAttribute('id');
    let el = 'h2';
    const text = h[i].innerHTML;

    switch(h[i].localName) {
      case 'h2':
      el = 'h3';
      break;
      case 'h3':
      el = 'h4';
      break;
    }

    h[i].outerHTML = `
    <a class="page__heading-link"
       href="${permalink.href}#${id}">
      <${el} id="${id}">${text}</${el}>
    </a>
    `;
  }

  return this;
}

function insertLatex() {
  let tags = this.querySelectorAll('.latex--inline');
  for (let i = 0; i < tags.length; i++) {
    tags[i].innerHTML = katex.renderToString(tags[i].innerHTML, {
      displayMode: false
    });
  }
  tags = this.querySelectorAll('.latex--block')
  for (let i = 0; i < tags.length; i++) {
    tags[i].innerHTML = katex.renderToString(tags[i].innerHTML, {
      displayMode: true
    });
  }
  return this;
}

function injectSvg() {
  const imgs = this.querySelectorAll('img[src$="svg"]');
  for (let i = 0; i < imgs.length; i++) {
    const src = imgs[i].src;
    const svg = fs.readFileSync('dist/images/icons/' + src.replace(/.*\//, ''), 'utf8').replace(/\r?\n|\r/g, '');
    let attrs = '';

    for (let j = 0; j < imgs[i].attributes.length; j++) {
      const a = imgs[i].attributes[j];
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
      .pipe($.dom(headingAnchors))
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
