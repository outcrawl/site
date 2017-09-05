const path = require('path');
const {
  createFilePath
} = require('gatsby-source-filesystem');
const slug = require('slug');

exports.createTagPages = params => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const tagTemplate = path.resolve('src/templates/tag.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors)
        return;
      }

      // Get all tags
      const tags = new Set();
      for (const {
          node
        } of result.data.allMarkdownRemark.edges) {
        for (const tag of node.frontmatter.tags) {
          tags.add(tag);
        }
      }

      // Create page for each tag
      for (const tag of tags) {
        const path = slug(tag, {
          lower: true
        });
        createPage({
          path: `/tags/${path}/`,
          component: tagTemplate,
          context: {
            tag: tag
          }
        });
      }

      resolve();
    })
  });
};
