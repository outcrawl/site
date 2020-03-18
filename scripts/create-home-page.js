const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;

  const homeTemplate = path.resolve('./src/templates/HomeTemplate.tsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        site {
          siteMetadata {
            articlesPerPage
          }
        }
        allMarkdownRemark {
          edges {
            node {
              id
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        return reject(result.errors);
      }

      const {
        allMarkdownRemark: { edges: articles },
        site: {
          siteMetadata: { articlesPerPage },
        },
      } = result.data;

      for (let i = 0, page = 1; i < articles.length - 1; i += articlesPerPage, page++) {
        createPage({
          path: page === 1 ? '/' : `/page/${page}`,
          component: homeTemplate,
          context: {
            page,
            articlesPerPage,
            skip: i,
            take: articlesPerPage,
          },
        });
      }

      return resolve();
    }).catch(reject);
  });
};
