import React from 'react';
import Helmet from 'react-helmet';
import escapeHtml from 'escape-html';

import _ from '../utils/helpers';

const makeSiteMeta = (meta) =>
  [
    <meta property="fb:app_id" content="863987620425609" />,
    <meta property="og:type" content="website" />,
    <meta property="og:site_name" content={meta.site.title} />,
    <meta name="twitter:card" content="summary_large_image" />,
    <meta name="twitter:site" content="@tinrab" />,
  ].map((e, i) => React.cloneElement(e, { key: i }));

const SiteMeta = ({ meta }) => {
  return <Helmet>{makeSiteMeta(meta)}</Helmet>;
};

const PageMeta = ({ page, image }) => {
  const { url, meta } = page;
  const { site, title } = page.meta;

  image = image || meta.site.siteUrl + '/featured.jpg';

  let description = meta.description || meta.site.description;
  if (!description.endsWith('.')) {
    description += '.';
  }

  return (
    <Helmet>
      {makeSiteMeta(meta)}

      <title>{title}</title>
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />

      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

const ArticleMeta = ({ article }) => {
  const { coverUrl, url, author } = article;
  const { site, date, title } = article.meta;

  let description = article.description;
  if (!description.endsWith('.')) {
    description += '.';
  }

  return (
    <Helmet>
      {makeSiteMeta(article.meta)}

      <title>{title}</title>
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={coverUrl} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />

      <meta name="twitter:image" content={coverUrl} />

      <script type="application/ld+json">
        {`{
        "@context":"https://schema.org",
        "@type":"Article",
        "publisher":{
          "@type":"Organization",
          "name":"${site.title} - ${site.description}",
          "logo":{
            "@type":"ImageObject",
            "url":"${site.siteUrl}/static/logo.png",
            "width":60,
            "height":60
          }
        },
        "author":{
          "@type":"Person",
          "name":"${author.name}",
          "image":{
            "@type":"ImageObject",
            "url":"https://www.gravatar.com/avatar/${author.emailHash}?s=50",
            "width":50,
            "height":50
          },
          "url":"${site.siteUrl}/authors/${author.slug}"
        },
        "headline":"${title}",
        "url":"${url}",
        "datePublished":"${date}",
        "image":{
          "@type":"ImageObject",
          "url":"${coverUrl}",
          "width":1280,
          "height":720
        },
        "description":"${description}",
        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":"${site.siteUrl}"
        }
      }`}
      </script>
    </Helmet>
  );
};

const AuthorMeta = ({ page }) => {
  const { meta, author } = page;
  const url = `${meta.site.siteUrl}/authors/${author.slug}`;
  const image = meta.site.siteUrl + '/featured.jpg';

  meta.title = `${author.name} - ${meta.site.title}`;
  meta.description = escapeHtml(author.bio);

  return (
    <Helmet>
      {makeSiteMeta(meta)}

      <title>{meta.title}</title>
      <link rel="canonical" href={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {`{
        "@context":"https://schema.org",
        "@type":"Person",
        "name":"${author.name}",
        "url":"${url}",
        "mainEntityOfPage":{
          "@type":"WebPage",
          "@id":"${meta.site.siteUrl}"
        }
      }`}
      </script>
    </Helmet>
  );
};

const HomeMeta = ({ page }) => {
  const meta = page.meta;
  page.meta.title = `${meta.site.title} - ${meta.site.description}`;

  return <PageMeta page={page} />;
};

const TagMeta = ({ page }) => {
  const meta = page.meta;
  page.meta.title = `${page.tag.name} - ${meta.site.title}`;
  page.meta.description = `Articles about ${page.tag.name} on ${
    meta.site.title
  }.`;

  return <PageMeta page={page} />;
};

const TagsPageMeta = ({ page }) => {
  const meta = page.meta;
  page.meta.title = `Tags - ${meta.site.title}`;
  page.meta.description = `All tags found on ${meta.site.title}.`;

  return <PageMeta page={page} />;
};

export default {
  SiteMeta,
  PageMeta,
  ArticleMeta,
  AuthorMeta,
  HomeMeta,
  TagMeta,
  TagsPageMeta,
};

function unwrap(element) {
  return element.props.children.map((obj, i) => {
    if (
      obj instanceof Object &&
      obj.hasOwnProperty('key') &&
      obj.key === null
    ) {
      return React.cloneElement(obj, {
        key: i,
      });
    }
    return obj;
  });
}
