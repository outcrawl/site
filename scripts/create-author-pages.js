const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;
  const authorTemplate = path.resolve('src/templates/AuthorTemplate.tsx');

  return new Promise((resolve, reject) => {
    return graphql(`
      {
        allDataYaml {
          edges {
            node {
              authors {
                slug
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return reject(result.errors);
      }

      const {
        allDataYaml: { edges: nodes },
      } = result.data;
      const authors = nodes[0].node.authors;

      for (let i = 0; i < authors.length; i++) {
        const author = authors[i];
        createPage({
          path: `authors/${author.slug}`,
          component: authorTemplate,
          context: {
            author: author.slug,
          },
        });
      }

      resolve();
    }).catch(reject);
  });
};
