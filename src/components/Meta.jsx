import React from 'react';
import Helmet from 'react-helmet';

import FeaturedImage from '../images/featured.jpg';
import unwrap from '../utils/unwrap.js';

const Meta = ({ page, siteMeta }) => (
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

    <meta name="keywords" content={siteMeta.keywords.join(',')} />
    <meta property="og:site_name" content={siteMeta.title} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={FeaturedImage} />
    <meta name="twitter:image:src" content={FeaturedImage} />
    <meta name="twitter:site" content="@tinrab" />
    <meta name="twitter:creator" content="@tinrab" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="google" content="notranslate" />
  </Helmet>
);

export default Meta;
