import { loadConfig } from '../config';
import escapeHTML from 'escape-html';
import Head from 'next/head';
import React from 'react';

type GeneralPageMetaProps = {
  title: string;
  description: string;
  url: string;
};

const GeneralPageMeta: React.FC<GeneralPageMetaProps> = (
  props: GeneralPageMetaProps,
) => {
  const config = loadConfig();
  const title = escapeHTML(props.title);
  const description = escapeHTML(props.description);
  const url = props.url;
  const featuredImage = `${config.url}/featured.jpg`;

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta property="fb:app_id" content={config.facebookId} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={config.twitterId} />

      <meta property="og:image" content={featuredImage} />
      <meta name="twitter:image" content={featuredImage} />
    </Head>
  );
};

export default GeneralPageMeta;
