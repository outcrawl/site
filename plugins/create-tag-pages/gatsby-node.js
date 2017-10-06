const path = require('path');
const slug = require('slug');

exports.createPages = (params, options, cb) => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const articlesPerPage = options.articlesPerPage;
  const tagTemplate = path.resolve('src/templates/tag.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(filter: {frontmatter: {layout: {eq: "article"}}}) {
          totalCount
          edges {
            node {
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors)
        return;
      }

      const data = result.data.allMarkdownRemark;

      // Get all tags and article count
      const articleCountForTag = {};
      for (const {
          node
        } of data.edges) {
        for (const tag of node.frontmatter.tags) {
          if (articleCountForTag[tag]) {
            articleCountForTag[tag]++;
          } else {
            articleCountForTag[tag] = 1;
          }
        }
      }

      // Create pages for each tag
      for (const tag in articleCountForTag) {
        const total = articleCountForTag[tag];
        const path = slug(tag, {
          lower: true
        });
        const tagSlug = slug(tag, {
          lower: true
        });
        const basePath = `/tags/${tagSlug}/`;
        let page = 1;

        for (let i = 0; i < total; i += articlesPerPage) {
          createPage({
            path: page === 1 ? basePath : `${basePath}page/${page}`,
            component: tagTemplate,
            context: {
              skip: i,
              limit: articlesPerPage,
              total: total,
              tag: tag,
              tagSlug: tagSlug,
              basePath: basePath
            }
          });
          page++;
        }
      }

      resolve();
      cb();
    }).catch(reject);
  });
};
