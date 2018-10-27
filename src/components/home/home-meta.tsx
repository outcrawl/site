import * as React from 'react';
import { Helmet } from 'react-helmet';
import { HomeInfo } from './types';
import * as escapeHtml from 'escape-html';

interface HomeMetaProps {
  info: HomeInfo;
}

class HomeMeta extends React.PureComponent<HomeMetaProps> {
  public render() {
    const { info } = this.props;

    const title = escapeHtml(info.title);
    const description = escapeHtml(info.description);

    return (
      <Helmet>
        <title>{info.title}</title>
        <link rel="canonical" href={info.url}/>

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
      </Helmet>
    );
  }
}

export default HomeMeta;
