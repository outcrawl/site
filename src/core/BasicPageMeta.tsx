import escapeHTML from 'escape-html';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { SiteMetadata } from './types';

type  BasicPageMetaProps = {
  title: string;
  description: string;
  url: string;
};

const BasicPageMeta: React.FC<BasicPageMetaProps> = (props: BasicPageMetaProps) => {
  const { url } = props;
  const title = escapeHTML(props.title);
  const description = escapeHTML(props.description);

  return (
    <StaticQuery
      query={graphql`
        query BasicPageMetaQuery {
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

        return (
          <Helmet>
            <title>{title}</title>
            <link rel="canonical" href={url}/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>

            <meta property="fb:app_id" content={siteMetadata.facebookId}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={siteMetadata.title}/>
            <meta property="og:url" content={url}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content={siteMetadata.twitterId}/>

            <meta property="og:image" content={siteMetadata.featuredImage}/>
            <meta name="twitter:image" content={siteMetadata.featuredImage}/>
          </Helmet>
        );
      }}
    />
  );
};

export default BasicPageMeta;
