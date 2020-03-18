import escapeHTML from 'escape-html';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { SiteMetadata } from '../core/types';
import { ArticlePageData } from './types';

type ArticleMetaProps = {
  articlePage: ArticlePageData;
};

const ArticleMeta: React.FC<ArticleMetaProps> = (props: ArticleMetaProps) => {
  const { articlePage, articlePage: { article } } = props;

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
              featuredImage
            }
          }
        }
      `}
      render={(data: { site: { siteMetadata: SiteMetadata } }): React.ReactNode => {
        const siteMetadata = data.site.siteMetadata;
        const title = escapeHTML(`${article.title} - ${siteMetadata.title}`);
        const description = articlePage.description && escapeHTML(articlePage.description);
        const date = article.date && new Date(article.date).toISOString().replace(/T.*$/, '');
        const author = article.author;
        const imageUrl = article.cover?.url || siteMetadata.featuredImage;

        return (
          <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={article.url}/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>

            <meta property="fb:app_id" content={siteMetadata.facebookId}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={siteMetadata.title}/>
            <meta property="og:url" content={article.url}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content={siteMetadata.twitterId}/>

            <meta property="og:image" content={imageUrl}/>
            <meta name="twitter:image" content={imageUrl}/>

            <script type="application/ld+json">
              {`{
                "@context":"https://schema.org",
                "@type":"Article",
                "publisher":{
                  "@type":"Organization",
                  "name":"${siteMetadata.title} - ${siteMetadata.description}",
                  "logo":{
                    "@type":"ImageObject",
                    "url":"${siteMetadata.siteUrl}/static/logo.png",
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
                    "url":"${siteMetadata.siteUrl}/authors/${author.slug}"
                  },
                `}
                "headline":"${title}",
                "url":"${article.url}",
                "datePublished":"${date}",
                  "image":{
                    "@type":"ImageObject",
                    "url":"${imageUrl}"
                  },
                "description":"${description}",
                "mainEntityOfPage":{
                  "@type":"WebPage",
                  "@id":"${siteMetadata.siteUrl}/"
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
