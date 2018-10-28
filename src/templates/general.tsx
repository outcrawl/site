import * as React from 'react';
import { graphql } from 'gatsby';

import { GeneralInfo, GeneralPage } from '../components/general';

interface GeneralTemplateProps {
  data: {
    page: any;
    site: any;
  };
}

class GeneralTemplate extends React.PureComponent<GeneralTemplateProps> {
  public render() {
    const { page, site } = this.props.data;
    const meta = site.siteMetadata;

    const info: GeneralInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
      },
      title: `${page.fields.title} - ${meta.title}`,
      description: `${page.fields.description}.`,
      url: `${ meta.siteUrl}/${page.fields.slug}`,
      image: {
        url: `${meta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
    };

    return <GeneralPage info={info} title={page.fields.title} html={page.html}/>;
  }
}

export default GeneralTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    page: markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      fields {
        title
        slug
        description
      }
    }
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
`;
