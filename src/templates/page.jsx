import React from 'react';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Meta from '../components/Meta';

export default ({ data }) => {
  const page = data.markdownRemark;
  Object.assign(page, data.markdownRemark.frontmatter);
  Object.assign(page, data.markdownRemark.fields);
  const siteMeta = data.site.siteMetadata;

  return (
    <Page contained={true}>
      <Meta page={page} siteMeta={siteMeta} />
      <PageSection>
        <h1>
          {page.title}
        </h1>
      </PageSection>
      <PageSection dangerouslySetInnerHTML={{ __html: page.html }}>
      </PageSection>
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
