import escapeHTML from 'escape-html';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { SiteMetadata } from '../core/types';

const HomeMeta: React.FC = () => {
  return (
    <StaticQuery
      query={graphql`
        query HomeMetaQuery {
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
      render={(data: { site: { siteMetadata: SiteMetadata } }): React.ReactNode => {
        const siteMetadata = data.site.siteMetadata;
        const title = escapeHTML(siteMetadata.title);
        const description = escapeHTML(siteMetadata.description);

        return (
          <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={siteMetadata.siteUrl}/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>

            <meta property="fb:app_id" content={siteMetadata.facebookId}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={siteMetadata.title}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content={siteMetadata.twitterId}/>

            <meta property="og:image" content={`${siteMetadata.siteUrl}/static/featured.jpg`}/>
            <meta property='og:image:width' content="1280"/>
            <meta property='og:image:height' content="1280"/>
            <meta name="twitter:image" content={`${siteMetadata.siteUrl}/static/featured.jpg`}/>
          </Helmet>
        );
      }}
    />
  );
};

export default HomeMeta;
