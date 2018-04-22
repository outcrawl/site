const toSlug = require('slug');
const md5 = require('md5');
const marked = require('marked');

const authors = require('../data/authors.json');

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  // return highlight(code, language);
};
renderer.heading = (text, level, raw) => {
  return `<h${level + 1}>${text}</h${level + 1}>`;
};
renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" />`;
};
renderer.html = (html) => {
  html = html.trim();
  if (html.startsWith('<note>')) {
    const note = html.substring(6, html.length - 7);
    return `
      <div class="page__note">
        ${note}
      </div>
    `;
  } else {
    throw new Error('Invalid shortcode: ' + html);
  }
};
marked.setOptions({ renderer });

module.exports = (boundActionCreators, node, getNode) => {
  const { createNodeField } = boundActionCreators;

  let slug = '';
  const path = getNode(node.parent).relativePath;

  if (path.startsWith('articles')) {
    createNodeField({ node, name: 'type', value: 'article' });

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
  } else {
    createNodeField({ node, name: 'type', value: 'page' });

    // Slug
    slug = path.substring('pages/'.length, path.lastIndexOf('/'));
  }

  let markdown = node.internal.content;
  markdown = markdown.substr(markdown.indexOf('---', 3) + 3).trim();
  const html = marked(markdown);

  createNodeField({ node, name: 'slug', value: slug });
  createNodeField({ node, name: 'html', value: html });
};
