const toSlug = require('slug');
const md5 = require('md5');

const authors = require('../data/authors.json');

module.exports = (boundActionCreators, node, getNode) => {
  const { createNodeField } = boundActionCreators;

  let slug = '';
  const path = getNode(node.parent).relativePath;

  if (path.startsWith('articles')) {
    createNodeField({ node, name: 'type', value: 'article' });

    // Insert cover image
    /*
    const md = node.internal.content;
    const fm = md.indexOf('---', 3) + 3;
    node.internal.content =
      md.substr(0, fm) + '![](./cover.jpg)' + md.substr(fm);
    */

    // Date
    const date = path.substr('articles/'.length, '0000-00-00'.length);
    createNodeField({ node, name: 'date', value: date });

    // Slug
    slug = path.substring('articles/0000-00-00-'.length, path.lastIndexOf('/'));

    // Author
    const author = authors[node.frontmatter.author];
    author.slug = node.frontmatter.author;
    author.emailHash = md5(author.email.toLowerCase());
    createNodeField({ node, name: 'author', value: author });

    // Tags
    const tags = node.frontmatter.tags
      .sort()
      .map((tag) => ({ slug: toSlug(tag, { lower: true }), name: tag }));
    createNodeField({ node, name: 'tags', value: tags });

    // Markdown
    createNodeField({ node, name: 'markdown', value: node.internal.content });
  } else {
    createNodeField({ node, name: 'type', value: 'page' });

    // Slug
    slug = path.substring('pages/'.length, path.lastIndexOf('/'));

    // Markdown
    createNodeField({ node, name: 'markdown', value: node.internal.content });
  }

  createNodeField({ node, name: 'slug', value: slug });
};
