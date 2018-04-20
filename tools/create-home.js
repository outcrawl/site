const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    boundActionCreators: { createPage },
  } = params;
  const homeTemplate = path.resolve('./src/templates/home.js');

  return new Promise((resolve, reject) => {
    graphql(`
      query CreateHome {
        site {
          siteMetadata {
            articlesPerPage
          }
        }
        allMarkdownRemark(
          filter: { fields: { type: { eq: "article" } } }
          sort: { fields: [fields___date], order: DESC }
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `)
      .then((result) => {
        if (result.errors) {
          return reject(result.errors);
        }

        const {
          allMarkdownRemark: { edges: articles },
          site: {
            siteMetadata: { articlesPerPage },
          },
        } = result.data;

        for (
          let i = 0, page = 1;
          i < articles.length;
          i += articlesPerPage, page++
        ) {
          createPage({
            path: page == 1 ? '/' : `/page/${page}`,
            component: homeTemplate,
            context: {
              page,
              articlesPerPage,
              totalArticles: articles.length,
              // For GraphQL
              skip: i,
              take: articlesPerPage,
            },
          });
        }

        return resolve();
      })
      .catch(reject);
  });
};
