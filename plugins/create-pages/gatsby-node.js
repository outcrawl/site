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
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      const articleTemplate = path.resolve('./src/templates/article.js');
      const pageTemplate = path.resolve('./src/templates/page.js');

      result.data.allMarkdownRemark.edges.map(({
        node
      }) => {
        createPage({
          path: node.fields.slug,
          component: node.frontmatter.layout === 'article' ? articleTemplate : pageTemplate,
          context: {
            slug: node.fields.slug,
            tags: node.frontmatter.layout === 'article' ? node.frontmatter.tags : []
          }
        });
      });
      resolve();
    }).catch(reject);
  });
};
