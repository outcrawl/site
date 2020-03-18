const visit = require('unist-util-visit');

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'heading', (node) => {
    node.depth++;
  });
};
