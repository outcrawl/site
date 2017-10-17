import React from 'react';
import Helmet from 'react-helmet';

import unwrap from '../utils/unwrap.js';

const SiteMeta = ({ siteMeta, image }) => {
  return (
    <Helmet>
      <meta property="fb:app_id" content="863987620425609" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteMeta.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tinrab" />

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
    </Helmet>
  );
};

const PageMeta = ({ siteMeta, image, title, description, url }) => {
  image = image || (siteMeta.siteUrl + '/featured.jpg');

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

      <script type="application/ld+json">
      {`{
        "@context":"http://schema.org",
        "@type":"WebSite",
        "url":"${url}",
        "name":"${title}",
        "description":"${description}",
        "publisher":"${siteMeta.title}",
        "potentialAction":{
          "@type":"SearchAction",
          "target":"${siteMeta.siteUrl}/search/?q={search_term}",
          "query-input":"required name=search_term"
        }
      }`}
      </script>
    </Helmet>
  );
};

const ArticleMeta = ({ siteMeta, article }) => {
  const title = article.title.replace(/"/g, '&quot;');
  const description = article.description.replace(/"/g, '&quot;');
  const date = new Date(Date.parse(article.date)).toISOString().replace(/T.*$/, '');
  const cover = article.cover;

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={article.permalink} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={cover.src} />
      <meta property="og:image:width" content={cover.width} />
      <meta property="og:image:height" content={cover.height} />

      <meta name="twitter:image" content={cover.src} />

      <script type="application/ld+json">
      {`{
        "@context":"http://schema.org",
        "@type":"BlogPosting",
        "headline":"${title}",
        "image":"${article.cover}",
        "editor":"${article.authorData.name}",
        "genre":"${article.tags.map(tag => tag.toLowerCase()).join(' ')}",
        "keywords":"${article.tags.map(tag => tag.toLowerCase()).join(' ')}",
        "publisher":"${siteMeta.title}",
        "url":"${article.permalink}",
        "datePublished":"${date}",
        "dateCreated":"${date}",
        "dateModified":"${date}",
        "description":"${description}",
        "author":{
          "@type":"Person",
          "name":"${article.authorData.name}"
        }
      }`}
      </script>
    </Helmet>
  );
};

export default {
  SiteMeta,
  PageMeta,
  ArticleMeta
};
