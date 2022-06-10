import { loadConfig } from '../config';
import { ArticleData } from './types';
import escapeHTML from 'escape-html';
import Head from 'next/head';
import React from 'react';

type ArticleMetaProps = {
  article: ArticleData;
};

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  article,
}: ArticleMetaProps) => {
  const config = loadConfig();
  const title = escapeHTML(`${article.title} - ${config.title}`);
  const description = escapeHTML(article.description);
  const date = new Date(article.date).toISOString().replace(/T.*$/, '');
  const coverUrl =
    article.cover !== undefined
      ? `${config.url}${article.cover.path}`
      : `${config.url}/featured.jpg`;

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={article.url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      <meta property="fb:app_id" content={config.facebookId} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:url" content={article.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={config.twitterId} />

      <meta property="og:image" content={coverUrl} />
      <meta name="twitter:image" content={coverUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
          "@context":"https://schema.org",
          "@type":"Article",
          "publisher":{
            "@type":"Organization",
            "name":"${config.title} - ${config.description}",
            "logo":{
              "@type":"ImageObject",
              "url":"${config.url}/logo.png",
              "width":60,
              "height":60
            }
          },
          ${
            article.author !== undefined
              ? `
            "author":{
              "@type":"Person",
              "name":"${article.author.name}",
              "image":{
                "@type":"ImageObject",
                "url":"${article.author.avatar}",
                "width":50,
                "height":50
              },
              "url":"${config.url}/authors/${article.author.slug}"
            },
          `
              : ''
          }
          "headline":"${title}",
          "url":"${article.url}",
          "datePublished":"${date}",
          "image":{
            "@type":"ImageObject",
            "url":"${coverUrl}"
          },
          "description":"${description}",
          "mainEntityOfPage":{
            "@type":"WebPage",
            "@id":"${config.url}/"
          }
        }`,
        }}
      />
    </Head>
  );
};

export default ArticleMeta;
