import React from 'react';
import Helmet from 'react-helmet';

const SiteMeta = ({ meta, image }) => (
  <Helmet>
    <meta property="fb:app_id" content="863987620425609" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={meta.site.title} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@tinrab" />
  </Helmet>
);

const PageMeta = ({ meta, image, title, description, url }) => {
  image = image || meta.site.siteUrl + '/featured.jpg';

  if (!description.endsWith('.')) {
    description += '.';
  }

  return (
    <Helmet>
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

const ArticleMeta = ({ meta }) => {
  let { title, description, date, coverUrl, permalink } = meta.page;

  if (!description.endsWith('.')) {
    description += '.';
  }

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={permalink} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={coverUrl} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />

      <meta name="twitter:image" content={coverUrl} />
    </Helmet>
  );
};

export default {
  SiteMeta,
  PageMeta,
  ArticleMeta,
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
