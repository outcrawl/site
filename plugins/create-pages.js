const path = require('path');

exports.createPages = (params) => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const pageTemplate = path.resolve('src/templates/page.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(filter: {frontmatter: {layout: {eq: "page"}}}) {
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
          component: pageTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      }

      resolve();
    })
  });
};
