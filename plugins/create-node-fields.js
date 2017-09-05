const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');
const slug = require('slug');

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
    }
  }
};
