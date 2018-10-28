import * as React from 'react';
import { Helmet } from 'react-helmet';
import * as escapeHtml from 'escape-html';

import { Author, AuthorInfo } from './types';

interface AuthorMetaProps {
  info: AuthorInfo;
  author: Author;
}

class AuthorMeta extends React.PureComponent<AuthorMetaProps> {
  public render() {
    const { info, author } = this.props;

    const url = `${info.site.url}/authors/${author.slug}`;
    const title = escapeHtml(`${author.name} - ${info.site.title}`);
    const description = escapeHtml(author.bio);

    return (
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url}/>

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
          "@type":"Person",
          "name":"${author.name}",
          "url":"${url}",
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

export default AuthorMeta;
