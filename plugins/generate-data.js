const fs = require('fs');
const moment = require('moment');
const marked = require('marked');
const frontMatter = require('front-matter');
const toSlug = require('slug');
const md5 = require('md5');

const authors = require('../data/authors.json');

// Setup marked
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  return `<pre><code>${code}</code></pre>`;
};
marked.setOptions({
  renderer,
});

function readArticles() {
  const articles = [];
  for (const dir of fs.readdirSync('./data/articles')) {
    const slug = dir.substr(11);
    const date = moment.utc(dir.substr(0, 12), 'YYYY-MM-DD');
    const md = fs.readFileSync('./data/articles/' + dir + '/index.md', 'utf8');
    const html = marked(md);
    const fm = frontMatter(md).attributes;
    const tags = fm.tags.sort().map(tag => ({
      name: tag,
      slug: toSlug(tag, {
        lower: true
      })
    }));
    const authorData = authors[fm.author];
    const author = {
      ...authorData,
      emailHash: md5(authorData.email.toLowerCase())
    };

    articles.push({
      type: 'article',
      slug,
      title: fm.title,
      author,
      description: fm.description,
      tags,
      date: date.format('DD MMMM, YYYY'),
      realDate: date.toDate(),
      html,
    });
  }
  return articles.sort((a, b) => b.realDate - a.realDate);
}

function readPages() {
  const pages = [];
  for (const slug of fs.readdirSync('./data/pages')) {
    const md = fs.readFileSync('./data/pages/' + slug + '/index.md', 'utf8');
    const html = marked(md);
    const fm = frontMatter(md).attributes;

    pages.push({
      type: 'page',
      slug: slug,
      title: fm.title,
      description: fm.description,
      html: html,
    });
  }
  return pages;
}

function generateData() {
  return {
    pages: readPages(),
    articles: readArticles(),
  };
}

module.exports = generateData;
