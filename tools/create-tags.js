const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    boundActionCreators: { createPage },
  } = params;
  const tagTemplate = path.resolve('./src/templates/tag.js');

  return new Promise((resolve, reject) => {
    graphql(`
      query CreateTags {
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
              fields {
                tags {
                  slug
                  name
                }
              }
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
          allMarkdownRemark: articles,
          site: {
            siteMetadata: { articlesPerPage },
          },
        } = result.data;

        // Group articles per tag
        const tagGroup = articles.edges.reduce((g, { node }) => {
          for (const tag of node.fields.tags) {
            if (g[tag.slug]) {
              g[tag.slug].count++;
            } else {
              g[tag.slug] = { tag, count: 1 };
            }
          }
          return g;
        }, {});

        for (const slug in tagGroup) {
          const { tag, count: total } = tagGroup[slug];
          const basePath = `/tags/${slug}`;

          // Create pages for tag
          for (let i = 0, page = 1; i < total; i += articlesPerPage, page++) {
            createPage({
              path: page == 1 ? basePath : `${basePath}/page/${page}`,
              component: tagTemplate,
              context: {
                page,
                tag,
                articlesPerPage,
                totalArticles: total,
                // For GraphQL
                tagName: tag.name,
                skip: i,
                take: articlesPerPage,
              },
            });
          }
        }

        return resolve();
      })
      .catch(reject);
  });
};
