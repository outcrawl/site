const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;
  const tagTemplate = path.resolve('./src/templates/TagTemplate.tsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          filter: { fields: { type: { eq: "article" } } }
          sort: { fields: [fields___date], order: DESC }
        ) {
          edges {
            node {
              fields {
                tags {
                  slug
                  title
                }
              }
            }
          }
        }
        site {
          siteMetadata {
            articlesPerPage
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
              g[tag.slug].size++;
            } else {
              g[tag.slug] = { tag, size: 1 };
            }
          }
          return g;
        }, {});

        for (const slug of Object.keys(tagGroup)) {
          const { tag, size: total } = tagGroup[slug];
          const basePath = `/tags/${slug}`;

          for (let i = 0, page = 1; i < total; i += articlesPerPage, page++) {
            createPage({
              path: page === 1 ? basePath : `${basePath}/page/${page}`,
              component: tagTemplate,
              context: {
                page,
                tag,
                articlesPerPage,
                tagSlug: tag.slug,
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
