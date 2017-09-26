const visit = require('unist-util-visit');
const cheerio = require('cheerio');
const slug = require('slug');
const marked = require('marked');

module.exports = ({
  files,
  markdownNode,
  markdownAST,
  getNode
}) => {
  visit(markdownAST, 'heading', node => {
    const id = slug(node.children[0].value, {lower:true});
    node.type = 'html';
    node.value = `
      <h${node.depth + 1} id="${id}" class="page-heading">
        ${node.children[0].value}
        <a href="#${id}" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" />
          </svg>
        </a>
      </h${node.depth + 1}>
    `;
  });

  visit(markdownAST, 'image', node => {
    if(node.url.endsWith('.gif')) {
      node.type = 'html';
      node.value = `
        <img src=${node.url} alt="${node.alt}" class="small-image"/>
      `;
    }
  });

  visit(markdownAST, 'html', node => {
    if (node.value.startsWith('<note')) {
      createNote(node);
    }
  });
};

function createNote(node) {
  const e = cheerio.load(node.value);
  node.value = `
    <div class="note">
      ${marked(e.text())}
    </div>
  `;
}
