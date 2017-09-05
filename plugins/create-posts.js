const path = require('path');

exports.createPosts = (params) => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const postTemplate = path.resolve('src/templates/post.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
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

      for (const {
          node
        } of result.data.allMarkdownRemark.edges) {
        createPage({
          path: node.fields.slug,
          component: postTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      }

      resolve();
    })
  });
};
