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
      {/* Favicons */}
      <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="icon" type="image/png" sizes="192x192" href="/favicons/android-chrome-192x192.png" />
      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />

      <link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)" href="/favicons/apple-touch-startup-image-320x460.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" href="/favicons/apple-touch-startup-image-640x920.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="/favicons/apple-touch-startup-image-640x1096.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/favicons/apple-touch-startup-image-750x1294.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)" href="/favicons/apple-touch-startup-image-1182x2208.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)" href="/favicons/apple-touch-startup-image-1242x2148.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)" href="/favicons/apple-touch-startup-image-748x1024.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)" href="/favicons/apple-touch-startup-image-768x1004.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)" href="/favicons/apple-touch-startup-image-1496x2048.png" />
      <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" href="/favicons/apple-touch-startup-image-1536x2008.png" />

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
