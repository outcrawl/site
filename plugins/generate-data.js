const fs = require('fs-extra');
const moment = require('moment');
const marked = require('marked');
const frontMatter = require('front-matter');
const toSlug = require('slug');
const md5 = require('md5');
const cheerio = require('cheerio');

const authors = require('../data/authors.json');

// Setup marked
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  return `<pre><code>${code}</code></pre>`;
};
renderer.heading = (text, level, raw) => {
  return `<h${level + 1}>${text}</h${level + 1}>`;
};
marked.setOptions({
  renderer,
});

function parseMarkdown(md, slug) {
  const params = frontMatter(md).attributes;
  let html = marked(md.substr(md.indexOf('---', 3) + 3));

  // Insert title
  html = '<h1>' + params.title + '</h1>' + html;

  // Change assets urls
  const $ = cheerio.load(html);
  $('img').each((_, img) => {
    const src = img.attribs.src;
    if (src && src.startsWith('./')) {
      img.attribs.src = `~/assets/.tmp/${slug}${src.substr(2)}`;
    }
  });
  html = $.html();

  return {
    params,
    html,
  };
}

function copyAssets(path, slug) {
  for (const asset of fs.readdirSync(path)) {
    if (asset.endsWith('jpg')) {
      const src = path + '/' + asset;
      const dest = './assets/.tmp/' + slug + '/' + asset;
      fs.copySync(src, dest);
    }
  }
}

function readArticles() {
  const articles = [];

  for (const dir of fs.readdirSync('./data/articles')) {
    const path = './data/articles/' + dir;
    const slug = dir.substr(11);

    copyAssets(path, slug);

    // Parse markdown
    const {
      params,
      html
    } = parseMarkdown(fs.readFileSync(path + '/index.md', 'utf8'), slug);

    // Create params
    const date = moment.utc(dir.substr(0, 12), 'YYYY-MM-DD');
    const tags = params.tags.sort().map(tag => ({
      name: tag,
      slug: toSlug(tag, {
        lower: true
      })
    }));
    const authorData = authors[params.author];
    const author = {
      ...authorData,
      emailHash: md5(authorData.email.toLowerCase())
    };

    // Create article
    articles.push({
      type: 'article',
      slug,
      title: params.title,
      author,
      description: params.description,
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
    const {
      params,
      html
    } = parseMarkdown(md);

    pages.push({
      type: 'page',
      slug,
      title: params.title,
      description: params.description,
      html,
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
