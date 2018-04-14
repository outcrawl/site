const md5File = require('md5-file');
const fs = require('fs-extra');
const moment = require('moment');
const marked = require('marked');
const frontMatter = require('front-matter');
const toSlug = require('slug');
const md5 = require('md5');
const cheerio = require('cheerio');
const pretty = require('pretty');

const highlight = require('./highlight');
const copyAssets = require('./copy-assets');
const authors = require('../data/authors.json');

// Setup marked
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  return highlight.highlight(code, language);
};
renderer.heading = (text, level, raw) => {
  return `<h${level + 1}>${text}</h${level + 1}>`;
};
renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" />`;
};
marked.setOptions({
  renderer,
});

const assetMap = copyAssets.linkAssets();

function parseMarkdown(md, slug) {
  const params = frontMatter(md).attributes;
  params.type = params.author ? 'article' : 'page';
  let html = marked(md.substr(md.indexOf('---', 3) + 3));

  // Insert cover image
  if (assetMap[slug + '/cover.jpg']) {
    html = `<img src="${assetMap[slug + '/cover.jpg']}" alt="${params.title}" title="a"/>` + html;
  }
  // Insert title
  html = '<h1>' + params.title + '</h1>' + html;

  // Change assets urls
  const $ = cheerio.load(html);
  $('img').each((_, img) => {
    const src = img.attribs.src;
    if (src && src.startsWith('./')) {
      img.attribs.src = assetMap[`${slug}/${src.substr(2)}`];
    }
  });
  html = pretty($.html(), {
    ocd: true,
  });

  return {
    params,
    html,
  };
}

function buildPage(slug) {
  let md = '';
  let dir = `./data/pages/${slug}/index.md`;

  if (fs.existsSync(`./data/pages/${slug}/index.md`)) {
    md = fs.readFileSync(dir, 'utf8');
  } else {
    for (const d of fs.readdirSync('./data/articles')) {
      if (d.endsWith(slug)) {
        dir = d;
        md = fs.readFileSync(`./data/articles/${dir}/index.md`, 'utf8');
        break;
      }
    }
  }

  const { params, html } = parseMarkdown(md, slug);

  if (params.type === 'page') {
    return {
      type: 'page',
      slug,
      title: params.title,
      description: params.description,
      html,
    };
  } else {
    const date = moment.utc(dir.substr(0, 12), 'YYYY-MM-DD');
    const tags = params.tags.sort().map(tag => ({
      name: tag,
      slug: toSlug(tag, {
        lower: true,
      }),
    }));
    const authorData = authors[params.author];
    const author = {
      ...authorData,
      emailHash: md5(authorData.email.toLowerCase()),
    };

    return {
      type: 'article',
      slug,
      title: params.title,
      coverUrl: assetMap[slug + '/cover.jpg'],
      author,
      description: params.description,
      tags,
      date: date.format('DD MMMM, YYYY'),
      realDate: date.toDate(),
      html,
    };
  }
}

export { buildPage };
