const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    boundActionCreators: { createPage },
  } = params;
  const tagsTemplate = path.resolve('./src/templates/tags.js');

  return new Promise((resolve, reject) => {
    graphql(`
      query CreateTagsPage {
        allMarkdownRemark(filter: { fields: { type: { eq: "article" } } }) {
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

        const { allMarkdownRemark: articles } = result.data;

        // Group articles per tag
        const tagGroup = articles.edges.reduce((g, { node }) => {
          for (const tag of node.fields.tags) {
            if (g[tag.slug]) {
              g[tag.slug].count++;
            } else {
              g[tag.slug] = { ...tag, count: 1 };
            }
          }
          return g;
        }, {});
        const allTags = Object.values(tagGroup).sort(
          (a, b) => b.count - a.count,
        );

        createPage({
          path: '/tags',
          component: tagsTemplate,
          context: {
            allTags,
          },
        });

        return resolve();
      })
      .catch(reject);
  });
};
