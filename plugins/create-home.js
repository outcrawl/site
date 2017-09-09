const path = require('path');
const Promise = require('bluebird');
const data = require('../gatsby-config').siteMetadata;
const postsPerPage = data.postsPerPage;

exports.createHome = params => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const homeTemplate = path.resolve('src/templates/home.jsx');

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
      {
        allMarkdownRemark(filter: {frontmatter: {layout: {eq: "post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
          totalCount
          edges {
            node {
              id
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
        const total = data.totalCount;
        let page = 1;

        for (let i = 0; i < total; i += postsPerPage) {
          createPage({
            path: page === 1 ? '/' : `/page/${page}`,
            component: homeTemplate,
            context: {
              skip: i,
              limit: postsPerPage,
              total: total
            }
          });
          page++;
        }
      })
    );
  });
};
