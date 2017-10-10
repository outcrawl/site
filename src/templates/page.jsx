import React from 'react';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Meta from '../components/Meta';

export default ({ data }) => {
  const page = {
    ...data.markdownRemark,
    ...data.markdownRemark.frontmatter,
    ...data.markdownRemark.fields
  };
  const siteMeta = data.site.siteMetadata;

  return (
    <Page component="article" narrow>
      <Meta page={page} siteMeta={siteMeta} />
      <Helmet>
        <title>{`${page.title} - ${siteMeta.title}`}</title>
        <link rel="canonical" href={`${siteMeta.siteUrl}${page.slug}`} />
        <meta name="title" content={`${page.title} - ${siteMeta.title}`} />
        <meta property="og:title" content={`${page.title} - ${siteMeta.title}`} />
      </Helmet>

      <PageSection>
        <h1>{page.title}</h1>
      </PageSection>
      <PageSection dangerouslySetInnerHTML={{ __html: page.html }} />
    </Page>
  );
};

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
      keywords
    }
  }
}
`;
