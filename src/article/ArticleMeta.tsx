import React from 'react';
import Helmet from 'react-helmet';
import { ArticlePageData } from './types';
import escapeHTML from 'escape-html';
import { graphql, StaticQuery } from 'gatsby';

type ArticleMetaProps = {
  articlePage: ArticlePageData;
};

const ArticleMeta: React.FC<ArticleMetaProps> = (props: ArticleMetaProps) => {
  const { articlePage, articlePage: { info } } = props;

  return (
    <StaticQuery
      query={graphql`
        query ArticleMetaQuery {
          site {
            siteMetadata {
              title
              description
              siteUrl
              twitterId
              facebookId
            }
          }
        }
      `}
      render={(data: { site: { siteMetadata: any } }): React.ReactNode => {
        const siteMetadata = data.site.siteMetadata;
        const title = escapeHTML(`${info.title} - ${siteMetadata.title}`);
        const description = articlePage.description && escapeHTML(articlePage.description);
        const date = info.date && new Date(info.date).toISOString().replace(/T.*$/, '');
        const author = info.author;

        return (
          <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={info.url}/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>

            <meta property="fb:app_id" content={siteMetadata.facebookId}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={siteMetadata.title}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content={siteMetadata.twitterId}/>

            {info.cover && <meta property="og:image" content={info.cover.url}/>}
            {info.cover && <meta property='og:image:width' content={info.cover.width + ''}/>}
            {info.cover && <meta property='og:image:height' content={info.cover.height + ''}/>}
            {info.cover && <meta name="twitter:image" content={info.cover.url}/>}

            <script type="application/ld+json">
              {`{
                "@context":"https://schema.org",
                "@type":"Article",
                "publisher":{
                  "@type":"Organization",
                  "name":"${siteMetadata.title} - ${siteMetadata.description}",
                  "logo":{
                    "@type":"ImageObject",
                    "url":"${siteMetadata.url}/static/logo.png",
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
                    "url":"${siteMetadata.url}/authors/${author.slug}"
                  },
                `}
                "headline":"${title}",
                "url":"${info.url}",
                "datePublished":"${date}",
                ${info.cover && `
                  "image":{
                    "@type":"ImageObject",
                    "url":"${info.cover.url}",
                    "width":${info.cover.width},
                    "height":${info.cover.height}
                  },
                `}
                "description":"${description}",
                "mainEntityOfPage":{
                  "@type":"WebPage",
                  "@id":"${siteMetadata.url}"
                }
              }`}
            </script>
          </Helmet>
        );
      }}
    />
  );
};

export default ArticleMeta;
