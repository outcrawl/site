const path = require('path');
const md5 = require('md5');
const {
  authors
} = require('../../data/authors');

exports.createPages = params => {
  const {
    boundActionCreators
  } = params;
  const {
    createPage
  } = boundActionCreators;
  const authorTemplate = path.resolve('src/templates/author.js');

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
};
