import React from 'react';
import Helmet from 'react-helmet';
import { MetaData } from '../common/types';
import escapeHTML from 'escape-html';

type HomeMetaProps = {
  data: MetaData;
};

const HomeMeta: React.FC<HomeMetaProps> = ({ data }: HomeMetaProps) => {
  const title = escapeHTML(data.title);
  const description = escapeHTML(data.description);

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={data.url}/>

      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>

      <meta property="fb:app_id" content={data.site.facebookId}/>
      <meta property="og:type" content="website"/>
      <meta property="og:site_name" content={data.site.title}/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content={data.site.twitterId}/>

      <meta property="og:image" content={data.image.url}/>
      <meta property='og:image:width' content={data.image.width.toString()}/>
      <meta property='og:image:height' content={data.image.height.toString()}/>
      <meta name="twitter:image" content={data.image.url}/>
    </Helmet>
  );
};

export default HomeMeta;
