const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');
const slug = require('slug');

exports.createPostFields = params => {
  const {
    node,
    getNode,
    boundActionCreators
  } = params;
  const {
    createNodeField
  } = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    // Slug
    createNodeField({
      node,
      name: 'slug',
      value: createFilePath({
        node,
        getNode,
        basePath: 'posts'
      })
    });
    // Slugify tags
    const slugTags = node.frontmatter.tags.map(tag => slug(tag, {
      lower: true
    }));
    createNodeField({
      node,
      name: 'slugTags',
      value: slugTags
    });
  }
};
