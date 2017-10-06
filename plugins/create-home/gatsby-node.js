const path = require('path');

exports.createPages = (params, options, cb) => {
  const {
    graphql,
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const articlesPerPage = options.articlesPerPage;
  const homeTemplate = path.resolve('./src/templates/home.jsx');

  return new Promise((resolve, reject) => {
    graphql(`
    {
      allMarkdownRemark(filter: {frontmatter: {layout: {eq: "article"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
        totalCount
        edges {
          node {
            id
          }
        }
      }
    }
  `).then(result => {
      const data = result.data.allMarkdownRemark;
      const total = data.totalCount;
      let page = 1;

      for (let i = 0; i < total; i += articlesPerPage) {
        createPage({
          path: page === 1 ? '/' : `/page/${page}`,
          component: homeTemplate,
          context: {
            skip: i,
            limit: articlesPerPage,
            total: total
          }
        });
        page++;
      }

      resolve();
      cb();
    }).catch(reject);
  });
};
