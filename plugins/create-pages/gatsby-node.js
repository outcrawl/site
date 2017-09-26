const path = require('path');

exports.createPages = ({
  graphql,
  boundActionCreators
}) => {
  const {
    createPage
  } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                layout
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      const postTemplate = path.resolve('./src/templates/post.jsx');
      const pageTemplate = path.resolve('./src/templates/page.jsx');

      result.data.allMarkdownRemark.edges.map(({
        node
      }) => {
        createPage({
          path: node.fields.slug,
          component: node.frontmatter.layout === 'post' ? postTemplate : pageTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      });
      resolve();
    }).catch(reject);
  });
};
