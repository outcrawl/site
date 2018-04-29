import escapeHtml from 'escape-html';

import _ from './helpers';

function formatDate(date) {
  date = new Date(date);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

export const getMeta = (data) => {
  const meta = {
    site: { ...data.site.siteMetadata },
  };
  if (data.markdownRemark) {
    const page = data.markdownRemark;

    meta.title = escapeHtml(`${page.frontmatter.title} - ${meta.site.title}`);

    if (page.frontmatter.description) {
      meta.description = escapeHtml(page.frontmatter.description);
    }

    if (page.fields.date) {
      meta.date = new Date(Date.parse(page.fields.date))
        .toISOString()
        .replace(/T.*$/, '');
    }
  }
  return meta;
};

const getRelated = (data) =>
  // Shuffle articles
  _.shuffle(
    data.related.edges.map(({ node }) => ({
      title: node.frontmatter.title,
      slug: node.fields.slug,
      tags: node.fields.tags,
    })),
  )
    // Remove current
    .filter((node) => node.slug != data.markdownRemark.fields.slug)
    // Take 3
    .slice(0, 3);

export const getArticle = (data) => {
  const article = {
    html: data.markdownRemark.html,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields,
    url: `${data.site.siteMetadata.siteUrl}/${data.markdownRemark.fields.slug}`,
    meta: getMeta(data),
  };

  if (data.markdownRemark.frontmatter.cover) {
    article.coverUrl =
      data.site.siteMetadata.siteUrl +
      data.markdownRemark.frontmatter.cover.childImageSharp.original.src;
  }

  if (data.related) {
    article.related = getRelated(data);
  }

  // Remove redundant fields
  delete article.cover;

  return article;
};

export const getGeneralPage = (data) => {
  const page = {
    html: data.markdownRemark.html,
    title: data.markdownRemark.frontmatter.title,
    slug: data.markdownRemark.fields.slug,
    url: `${data.site.siteMetadata.siteUrl}/${data.markdownRemark.fields.slug}`,
    meta: getMeta(data),
  };

  return page;
};

export const getAuthorPage = (data) => {
  const articles = data.allMarkdownRemark.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
    url: `${data.site.siteMetadata.siteUrl}/${node.fields.slug}`,
  }));
  const articlesByMonth = articles.reduce((g, a) => {
    const key = formatDate(a.date);
    (g[key] = g[key] || []).push(a);
    return g;
  }, {});
  const author = {
    meta: getMeta(data),
    articles,
    articlesByMonth,
  };

  return author;
};

export const getHomePage = (data) => {
  const articles = data.allMarkdownRemark.edges.map(({ node }) => ({
    ...node.fields,
    title: node.frontmatter.title,
    coverUrl:
      data.site.siteMetadata.siteUrl +
      node.frontmatter.cover.childImageSharp.original.src,
  }));

  const page = {
    meta: getMeta(data),
    articles,
  };

  return page;
};

export const getTagPage = (data) => {
  const articles = data.allMarkdownRemark.edges.map(({ node }) => ({
    ...node.fields,
    title: node.frontmatter.title,
    coverUrl:
      data.site.siteMetadata.siteUrl +
      node.frontmatter.cover.childImageSharp.original.src,
  }));

  const page = {
    meta: getMeta(data),
    articles,
  };

  return page;
};
