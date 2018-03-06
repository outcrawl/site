const visit = require('unist-util-visit');
const cheerio = require('cheerio');
const slug = require('slug');
const marked = require('marked');
const katex = require('katex');

module.exports = ({
  files,
  markdownNode,
  markdownAST,
  getNode
}) => {
  // Lower heading level
  visit(markdownAST, 'heading', node => {
    const id = slug(node.children[0].value, {
      lower: true
    });
    node.type = 'html';
    node.value = `
      <h${node.depth + 1} id="${id}">
        ${node.children[0].value}
      </h${node.depth + 1}>
    `;
  });

  // Modify gif markup
  visit(markdownAST, 'image', node => {
    if (node.url.endsWith('.gif')) {
      node.type = 'html';
      node.value = `
        <img src=${node.url} alt="${node.alt}" class="small-image"/>
      `;
    }
  });

  // Transform shortcodes
  visit(markdownAST, 'html', node => {
    if (node.value.startsWith('<note')) {
      createNote(node);
    }
  });

  return markdownAST;
};

function createNote(node) {
  const e = cheerio.load(node.value);
  node.value = `
    <div class="note">
      ${marked(e.text())}
    </div>
  `;
}
