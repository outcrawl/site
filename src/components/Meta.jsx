import React from 'react';
import Helmet from 'react-helmet';

import featuredImage from '../images/featured.jpg';
import unwrap from '../utils/unwrap.js';

const Meta = ({ page, siteMeta }) => {
  let image = featuredImage;
  if (!featuredImage.startsWith('http')) {
    image = siteMeta.siteUrl + '/' + featuredImage;
  }

  return (
    <Helmet>
      {page ? unwrap(
        <wrap>
          <title>{`${page.title} - ${siteMeta.title}`}</title>
          <meta name="title" content={`${page.title} - ${siteMeta.title}`} />
          <meta name="description" content={page.description} />
          <meta name="twitter:description" content={page.description} />
          <meta property="al:web:url" content={`${siteMeta.siteUrl}${page.slug}`} />
          <meta property="og:title" content={`${page.title} - ${siteMeta.title}`} />
          <meta property="og:url" content={`${siteMeta.siteUrl}${page.slug}`} />
          <meta property="og:description" content={page.description} />
        </wrap>
      ) : ''}

      <meta property="fb:app_id" content="863987620425609" />
      <meta name="keywords" content={siteMeta.keywords.join(',')} />
      <meta property="og:site_name" content={siteMeta.title} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta name="twitter:image:src" content={image} />
      <meta name="twitter:site" content="@tinrab" />
      <meta name="twitter:creator" content="@tinrab" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="google" content="notranslate" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default Meta;
