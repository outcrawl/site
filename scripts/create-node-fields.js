const toSlug = require('slug');

function markdownFields(node, getNode, createNodeField) {
  let slug = '';
  const path = getNode(node.parent).relativePath;

  if (path.startsWith('articles')) {
    createNodeField({ node, name: 'type', value: 'article' });
    createNodeField({ node, name: 'title', value: node.frontmatter.title });
    createNodeField({ node, name: 'description', value: node.frontmatter.description });
    createNodeField({ node, name: 'author', value: node.frontmatter.author });
    createNodeField({ node, name: 'cover', value: node.frontmatter.cover });

    // Date
    const date = path.substr('articles/'.length, '0000-00-00'.length);
    createNodeField({ node, name: 'date', value: date });

    // Slug
    slug = path.substring('articles/0000-00-00-'.length, path.lastIndexOf('/'));

    // Tags
    const tags = node.frontmatter.tags
      .sort()
      .map((tag) => ({ slug: toSlug(tag, { lower: true }), title: tag }));
    createNodeField({ node, name: 'tags', value: tags });
  } else {
    createNodeField({ node, name: 'type', value: 'page' });
    createNodeField({ node, name: 'title', value: node.frontmatter.title });
    createNodeField({ node, name: 'description', value: node.frontmatter.description });

    // Slug
    slug = path.substring('pages/'.length, path.lastIndexOf('/'));
  }

  createNodeField({ node, name: 'slug', value: slug });
}

module.exports = ({ node, getNode, actions: { createNodeField } }) => {
  if (node.internal.type === 'MarkdownRemark') {
    markdownFields(node, getNode, createNodeField);
  }
};
