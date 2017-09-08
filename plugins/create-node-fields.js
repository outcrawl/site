const {
  createFilePath
} = require('gatsby-source-filesystem');
const slug = require('slug');
const md5 = require('md5');
const authors = require('../data/authors.js').authors;

function createPageFields(createNodeField, node, getNode, basePath) {
  // Slug
  createNodeField({
    node,
    name: 'slug',
    value: createFilePath({
      node,
      getNode,
      basePath: basePath
    })
  });

  // Slugify post tags
  if (basePath === 'posts') {
    const slugTags = node.frontmatter.tags.map(tag => slug(tag, {
      lower: true
    }));
    createNodeField({
      node,
      name: 'slugTags',
      value: slugTags
    });

    // Author data
    const author = authors[node.frontmatter.author];
    createNodeField({
      node,
      name: 'authorData',
      value: {
        name: author.name,
        emailHash: md5(author.email.toLowerCase()),
        social: author.social
      }
    });

    // Inject cover image
    const md = node.internal.content;
    node.internal.content = md.replace(/(---[\S\s]*---)/, '$&\n![Cover](cover.jpg)');
  }
}

exports.createNodeFields = params => {
  const {
    node,
    getNode,
    boundActionCreators
  } = params;
  const {
    createNodeField
  } = boundActionCreators;

  if (node.internal.type === 'MarkdownRemark') {
    let basePath = 'posts';
    if (node.frontmatter.layout === 'page') {
      basePath = 'pages';
    }
    createPageFields(createNodeField, node, getNode, basePath);
  }
};
