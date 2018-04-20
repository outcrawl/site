const path = require('path');
const md5 = require('md5');

const authors = require(path.resolve('data/authors'));

module.exports = (params) => {
  const {
    boundActionCreators: { createPage },
  } = params;
  const authorTemplate = path.resolve('src/templates/author.js');

  for (const slug in authors) {
    const author = authors[slug];
    author.emailHash = md5(author.email.toLowerCase());
    author.slug = slug;

    createPage({
      path: `/authors/${slug}`,
      component: authorTemplate,
      context: {
        author,
        // For GraphQL
        authorSlug: slug,
      },
    });
  }
};
