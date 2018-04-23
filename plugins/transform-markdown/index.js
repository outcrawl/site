const visit = require('unist-util-visit');
const $ = require('cheerio');
const slug = require('slug');
const marked = require('marked');
const rangeParser = require('parse-numeric-range');

function highlight(code, lang) {
  code = code.trim();

  if (!lang) {
    // Highlight prompt
    const html = code.replace(/^\$/gm, '<span class="code__prompt">$&</span>');
    return `
      <div class="code">
        <pre><code>${html}</code></pre>
      </div>
    `;
  }

  let lines = [];
  [lang, lines] = findHighlights(lang);

  // Switch keys
  lang = lang == 'js' ? 'javascript' : lang;
  lang = lang == 'ts' ? 'typescript' : lang;
  lang = lang == 'html' ? 'markup' : lang;
  lang = lang == 'dockerfile' ? 'docker' : lang;

  const Prism = require('prismjs');

  if (lang == 'cpp') {
    require(`prismjs/components/prism-c.js`);
  }
  if (!Prism.languages[lang]) {
    require(`prismjs/components/prism-${lang}.js`);
  }

  let html = Prism.highlight(code, Prism.languages[lang]);

  // Highlight lines
  if (lines.length > 0) {
    const sourceLines = html.split('\n');
    html = '';
    for (let i = 0; i < sourceLines.length; i++) {
      const mark = lines.find((x) => x.line == i + 1);
      if (mark) {
        html += `<span class="code__line-${mark.type}">${
          sourceLines[i]
        }</span>`;
      } else {
        html += sourceLines[i] + '\n';
      }
    }
  }

  return `
    <div class="code code--${lang}">
      <pre><code>${html}</code></pre>
    </div>
  `;
}

function findHighlights(lang) {
  if (!/(\+|-|){/.test(lang)) {
    return [lang, []];
  }

  const source = lang;
  lang = lang.replace(/[^a-z]/g, '');

  let lines = [];

  source.replace(/[+-]{0,1}{[0-9,\-]+}/g, (m) => {
    if (m.startsWith('+')) {
      const r = rangeParser.parse(m.substring(2, m.length - 1));
      lines.push(...r.map((i) => ({ line: i, type: 'add' })));
    } else if (m.startsWith('-')) {
      const r = rangeParser.parse(m.substring(2, m.length - 1));
      lines.push(...r.map((i) => ({ line: i, type: 'remove' })));
    } else {
      const r = rangeParser.parse(m.substring(1, m.length - 1));
      lines.push(...r.map((i) => ({ line: i, type: 'highlight' })));
    }
  });

  return [lang, lines];
}

module.exports = ({ files, markdownNode, markdownAST, getNode }) => {
  // Lower heading level
  visit(markdownAST, 'heading', (node) => {
    const id = slug(node.children[0].value, {
      lower: true,
    });
    node.type = 'html';
    node.value = `
      <h${node.depth + 1} id="${id}">
        ${node.children[0].value}
      </h${node.depth + 1}>
    `;
  });

  visit(markdownAST, 'code', (node) => {
    node.type = 'html';
    node.value = highlight(node.value, node.lang);
  });

  visit(markdownAST, 'html', (node) => {
    // Change image
    const wrapper = $('.gatsby-resp-image-wrapper', node.value);
    if (wrapper.length > 0) {
      const img = $(wrapper).find('.gatsby-resp-image-image');
      node.value = `
        <img
          src="${img.attr('src')}"
          alt="${img.attr('alt')}"
          sizes="${img.attr('sizes')}"
          srcset="${img.attr('srcset')}"
        />
      `;
      return;
    }

    // Note
    const note = $('note', node.value);
    if (note.length > 0) {
      let html = marked(note.text());
      html = html.substring(3, html.length - 5);
      node.value = `<aside class="page__note">${html}</aside>`;
      return;
    }
  });

  return markdownAST;
};
