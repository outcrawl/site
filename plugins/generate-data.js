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
    const date = moment(dir.substr(0, 11), 'YYYY-MM-DD').toDate();
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
      layout: 'article',
      slug: slug,
      title: fm.title,
      author: author,
      description: fm.description,
      tags: tags,
      date: date,
      html: html,
    });
  }
  return articles;
}

function readPages() {
  const pages = [];
  for (const slug of fs.readdirSync('./data/pages')) {
    const md = fs.readFileSync('./data/pages/' + slug + '/index.md', 'utf8');
    const html = marked(md);
    const fm = frontMatter(md).attributes;

    pages.push({
      layout: 'page',
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
    pages: [
      ...readArticles(),
      ...readPages(),
    ],
  };
}

module.exports = generateData;
