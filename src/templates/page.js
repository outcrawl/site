import React from 'react';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import { SiteMeta, PageMeta } from '../components/Meta';

export default ({ data }) => {
  const page = {
    ...data.markdownRemark,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields
  };
  const siteMeta = data.site.siteMetadata;

  return (
    <Page component="article" narrow>
      <SiteMeta siteMeta={siteMeta} />
      <PageMeta
        siteMeta={siteMeta}
        title={`${page.title} - ${siteMeta.title}`}
        description={page.description}
        url={`${siteMeta.siteUrl}/${page.slug}`}
      />

      <PageSection>
        <h1>{page.title}</h1>
      </PageSection>
      <PageSection dangerouslySetInnerHTML={{ __html: page.html }} />
    </Page>
  );
}

export const query = graphql`
query PageQuery($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    html
    frontmatter {
      title
      description
    }
    fields {
      slug
    }
  }

  site {
    siteMetadata {
      title
      description
      siteUrl
      facebookPublisherUrl
    }
  }
}
`;
