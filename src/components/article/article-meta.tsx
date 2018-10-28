import * as React from 'react';
import { Helmet } from 'react-helmet';
import * as escapeHtml from 'escape-html';

import { Article, ArticleInfo } from './types';

interface ArticleMetaProps {
  info: ArticleInfo;
  article: Article;
}

class ArticleMeta extends React.PureComponent<ArticleMetaProps> {
  public render() {
    const { info, article } = this.props;
    const author = article.author;

    const title = escapeHtml(`${article.title} - ${info.site.title}`);
    const description = escapeHtml(article.description);
    const date = new Date(article.date).toISOString().replace(/T.*$/, '');

    return (
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={article.url}/>

        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>

        <meta property="fb:app_id" content={info.site.facebookId}/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content={info.site.title}/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content={info.site.twitterId}/>

        <meta property="og:image" content={info.image.url}/>
        <meta property='og:image:width' content={info.image.width + ''}/>
        <meta property='og:image:height' content={info.image.height + ''}/>
        <meta name="twitter:image" content={info.image.url}/>

        <script type="application/ld+json">
          {`{
          "@context":"https://schema.org",
          "@type":"Article",
          "publisher":{
            "@type":"Organization",
            "name":"${info.site.title} - ${info.site.description}",
            "logo":{
              "@type":"ImageObject",
              "url":"${info.site.url}/static/logo.png",
              "width":60,
              "height":60
            }
          },
          "author":{
            "@type":"Person",
            "name":"${author.name}",
            "image":{
              "@type":"ImageObject",
              "url":"${author.avatar}",
              "width":50,
              "height":50
            },
            "url":"${info.site.url}/authors/${author.slug}"
          },
          "headline":"${title}",
          "url":"${article.url}",
          "datePublished":"${date}",
          "image":{
            "@type":"ImageObject",
            "url":"${info.image.url}",
            "width":${info.image.width},
            "height":${info.image.height}
          },
          "description":"${description}",
          "mainEntityOfPage":{
            "@type":"WebPage",
            "@id":"${info.site.url}"
          }
        }`}
        </script>

      </Helmet>
    );
  }
}

export default ArticleMeta;
