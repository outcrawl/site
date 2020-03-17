const path = require('path');

module.exports = (params) => {
  const {
    graphql,
    actions: { createPage },
  } = params;
  const articleTemplate = path.resolve(`./src/templates/ArticleTemplate.tsx`);
  const pageTemplate = path.resolve(`./src/templates/GeneralTemplate.tsx`);

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
                tags {
                  slug
                }
              }
            }
          }
        }
      }
    `).then((result) => {
      if (result.errors) {
        return reject(result.errors);
      }

      const { allMarkdownRemark: { edges: pages } } = result.data;

      for (const page of pages) {
        if (!page.node.fields) {
          continue;
        }

        const fields = page.node.fields;
        let tags = (fields.tags || []).map((tag) => tag.slug);

        createPage({
          path: fields.slug,
          component: fields.type === 'article' ? articleTemplate : pageTemplate,
          context: {
            slug: fields.slug,
            author: fields.author,
            tags: tags,
          },
        });
      }

      resolve();
    }).catch(reject);
  });
};
