import { graphql } from 'gatsby';
import React from 'react';
import { SiteMetadata } from '../core/types';
import GeneralPage from '../general/GeneralPage';
import { GeneralPageData } from '../general/types';

type GeneralTemplateProps = {
  data: {
    page: {
      html: string;
      fields: {
        title: string;
        slug: string;
        description: string;
      };
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
};

const GeneralTemplate: React.FC<GeneralTemplateProps> = (props: GeneralTemplateProps) => {
  const { data: { page, site: { siteMetadata } } } = props;
  const generalPage: GeneralPageData = {
    ...page.fields,
    html: page.html,
    url: `${siteMetadata.siteUrl}/${page.fields.slug}`,
  };

  return <GeneralPage generalPage={generalPage}/>;
};

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
        siteUrl
      }
    }
  }
`;
