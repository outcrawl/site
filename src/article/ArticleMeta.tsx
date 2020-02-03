import React from 'react';
import Helmet from 'react-helmet';
import { ArticlePageData } from './types';
import escapeHTML from 'escape-html';

type ArticleMetaProps = {
  data: ArticlePageData;
};

const ArticleMeta: React.FC<ArticleMetaProps> = (props: ArticleMetaProps) => {
  const { data, data: { info } } = props;

  const title = escapeHTML(`${info.title} - ${data.meta.site.title}`);
  const description = data.description && escapeHTML(data.description);
  const date = info.date && new Date(info.date).toISOString().replace(/T.*$/, '');
  const author = info.author;

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={info.url}/>

      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>

      <meta property="fb:app_id" content={data.meta.site.facebookId}/>
      <meta property="og:type" content="website"/>
      <meta property="og:site_name" content={data.meta.site.title}/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content={data.meta.site.twitterId}/>

      {data.cover && <meta property="og:image" content={data.cover.url}/>}
      {data.cover && <meta property='og:image:width' content={data.cover.width + ''}/>}
      {data.cover && <meta property='og:image:height' content={data.cover.height + ''}/>}
      {data.cover && <meta name="twitter:image" content={data.cover.url}/>}

      <script type="application/ld+json">
        {`{
          "@context":"https://schema.org",
          "@type":"Article",
          "publisher":{
            "@type":"Organization",
            "name":"${data.meta.site.title} - ${data.meta.site.description}",
            "logo":{
              "@type":"ImageObject",
              "url":"${data.meta.site.url}/static/logo.png",
              "width":60,
              "height":60
            }
          },
          ${author && `
            "author":{
              "@type":"Person",
              "name":"${author.name}",
              "image":{
                "@type":"ImageObject",
                "url":"${author.avatar}",
                "width":50,
                "height":50
              },
              "url":"${data.meta.site.url}/authors/${author.slug}"
            },
          `}
          "headline":"${title}",
          "url":"${info.url}",
          "datePublished":"${date}",
          ${data.cover && `
            "image":{
              "@type":"ImageObject",
              "url":"${data.cover.url}",
              "width":${data.cover.width},
              "height":${data.cover.height}
            },
          `}
          "description":"${description}",
          "mainEntityOfPage":{
            "@type":"WebPage",
            "@id":"${data.meta.site.url}"
          }
        }`}
      </script>
    </Helmet>
  );
};

export default ArticleMeta;
