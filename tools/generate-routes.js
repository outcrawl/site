const fs = require('fs-extra');

const fetchArticles = require('./fetch-articles');
const authors = require('../data/authors.json');

module.exports = function generateRoutes(articlesPerPage) {
  let routes = [];
  // Pages
  for (const dir of fs.readdirSync('./data/pages')) {
    routes.push('/' + dir);
  }
  // Articles
  const articles = fetchArticles();
  for (const article of articles) {
    routes.push('/' + article.slug);
  }
  // Home pages
  if (articles.length > articlesPerPage) {
    let page = Math.ceil(articles.length / articlesPerPage);
    while (--page) {
      routes.push(`/page/${page + 1}`);
    }
  }
  // Author pages
  for (const author of Object.keys(authors)) {
    routes.push('/authors/' + author);
  }
  // Tags
  const tags = articles.reduce((tags, article) => {
    for (const tag of article.tags) {
      tags[tag.slug] = (tags[tag.slug] || 0) + 1;
    }
    return tags;
  }, {});
  routes = [...routes, ...Object.keys(tags).map(tag => '/tags/' + tag)];
  // Tag pages
  for (const tag of Object.keys(tags)) {
    let page = Math.ceil(tags[tag] / articlesPerPage);
    while (--page) {
      routes.push(`/tags/${tag}/page/${page + 1}`);
    }
  }
  return routes;
};
