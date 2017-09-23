const path = require('path');
const Promise = require('bluebird');
const data = require('../gatsby-config').siteMetadata;
const postsPerPage = data.postsPerPage;
const slug = require('slug');

exports.createTagPages = params => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const tagTemplate = path.resolve('src/templates/tag.jsx');

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
      {
        allMarkdownRemark(filter: {frontmatter: {layout: {eq: "post"}}}) {
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

        // Get all tags and post count
        const postCountForTag = {};
        for (const {
            node
          } of data.edges) {
          for (const tag of node.frontmatter.tags) {
            if (postCountForTag[tag]) {
              postCountForTag[tag]++;
            } else {
              postCountForTag[tag] = 1;
            }
          }
        }

        // Create pages for each tag
        for (const tag in postCountForTag) {
          const total = postCountForTag[tag];
          const path = slug(tag, {
            lower: true
          });
          const tagSlug = slug(tag,{lower:true});
          const basePath = `/tags/${tagSlug}/`;
          let page = 1;

          for (let i = 0; i < total; i += postsPerPage) {
            createPage({
              path: page === 1 ? basePath : `${basePath}page/${page}`,
              component: tagTemplate,
              context: {
                skip: i,
                limit: postsPerPage,
                total: total,
                tag: tag,
                tagSlug: tagSlug,
                basePath: basePath
              }
            });
            page++;
          }
        }
      })
    );
  });
};
