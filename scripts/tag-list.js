const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;
  const tagsTemplate = path.resolve('./src/templates/tag-list.tsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(filter: { fields: { type: { eq: "article" } } }) {
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
      }
    `)
      .then((result) => {
        if (result.errors) {
          return reject(result.errors);
        }

        const { allMarkdownRemark: articles } = result.data;

        const tagGroup = articles.edges.reduce((g, { node }) => {
          for (const tag of node.fields.tags) {
            if (g[tag.slug]) {
              g[tag.slug].size++;
            } else {
              g[tag.slug] = { ...tag, size: 1 };
            }
          }
          return g;
        }, {});
        const allTags = Object.values(tagGroup).sort(
          (a, b) => b.size - a.size,
        );

        createPage({
          path: '/tags',
          component: tagsTemplate,
          context: {
            tagGroups: allTags,
          },
        });

        return resolve();
      })
      .catch(reject);
  });
};
