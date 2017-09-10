const path = require('path');
const authors = require('../data/authors').authors;
const md5 = require('md5');

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
    author.emailHash = md5(author.email.toLowerCase());

    createPage({
      path: `/authors/${slug}/`,
      component: authorTemplate,
      context: {
        author: slug,
        authorData: author
      }
    });
  }
}
