const path = require('path');

exports.createHome = params => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const homeTemplate = path.resolve('src/templates/home.jsx');

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

      resolve();
    })
  });
};
