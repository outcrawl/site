import _ from './helpers';

export const getMeta = (data) => {
  const meta = {
    site: data.site.siteMetadata,
  };
  if (data.markdownRemark) {
    const page = data.markdownRemark;
    meta.page = {
      title:
        page.frontmatter.title.replace(/"/g, '&quot;') +
        ' - ' +
        meta.site.title,
      permalink: `${meta.site.siteUrl}/${page.fields.slug}`,
    };
    if (page.frontmatter.description) {
      meta.page.description = page.frontmatter.description.replace(
        /"/g,
        '&quot;',
      );
    }
    if (page.frontmatter.date) {
      meta.page.date = new Date(Date.parse(page.frontmatter.date))
        .toISOString()
        .replace(/T.*$/, '');
    }
    if (page.frontmatter.cover) {
      meta.page.coverUrl =
        meta.site.siteUrl + page.frontmatter.cover.childImageSharp.original.src;
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
  const meta = getMeta(data);
  const article = {
    html: data.markdownRemark.html,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields,
    permalink: `${meta.site.siteUrl}/${data.markdownRemark.fields.slug}`,
  };

  if (data.markdownRemark.frontmatter.cover) {
    article.coverUrl =
      meta.site.siteUrl +
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
  const meta = getMeta(data);
  const page = {
    html: data.markdownRemark.html,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields,
    permalink: `${meta.site.siteUrl}/${data.markdownRemark.fields.slug}`,
  };
  return page;
};

export const getArticles = (data) => {
  return data.allMarkdownRemark.edges.map(({ node }) => {
    return getArticle({ site: data.site, markdownRemark: node });
  });
};
