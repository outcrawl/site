const fs = require('fs-extra');
const moment = require('moment');
const md5 = require('md5');

const authors = require('~/data/authors.json');
const fetchPages = require('./fetch-pages');

function fetchAuthor(slug) {
  const author = authors[slug];
  author.emailHash = md5(author.email.toLowerCase());
  author.slug = slug;

  // Get articles by author
  const articles = fetchPages.fetchArticles();
  author.articles = articles.filter(a => a.author.slug === slug);

  // Group articles by month
  author.articlesByMonth = author.articles.reduce((m, a) => {
    const key = moment(a.realDate).format('MMMM, YYYY');
    (m[key] = m[key] || []).push(a);
    return m;
  }, {});

  return author;
}

export { fetchAuthor };
