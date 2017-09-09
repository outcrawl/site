const path = require('path');
const authors = require('../data/authors');

exports.createAuthorPages = params => {
  const {
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const authorTemplate = path.resolve('src/templates/author.jsx');

  for (const slug in authors) {
    const author = authors[slug];

    createPage({
      path: `/authors/${slug}/`,
      component: authorTemplate,
      context: {
        slug: slug
      }
    });
  }
}
