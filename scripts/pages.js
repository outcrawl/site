const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;
  const articleTemplate = path.resolve(`./src/templates/article.tsx`);
  const pageTemplate = path.resolve(`./src/templates/general.tsx`);

  return new Promise((resolve, reject) => {
    return graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                type
                author
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
        allMarkdownRemark: { edges: pages },
      } = result.data;

      for (let i = 0; i < pages.length; i++) {
        const fields = pages[i].node.fields;

        createPage({
          path: fields.slug,
          component: fields.type === 'article' ? articleTemplate : pageTemplate,
          context: {
            slug: fields.slug,
            author: fields.author,
          },
        });
      }

      resolve();
    }).catch(reject);
  });
};
