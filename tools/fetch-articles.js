const fs = require('fs-extra');

const buildPage = require('./build-page');

module.exports = function fetchArticles() {
  const articles = [];
  // Build articles
  for (const dir of fs.readdirSync('./data/articles')) {
    const slug = dir.substr(11);
    articles.push(buildPage(slug));
  }
  return articles.sort((a, b) => b.realDate - a.realDate);
};
