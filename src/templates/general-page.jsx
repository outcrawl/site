import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Meta from '../components/Meta';

const GeneralPage = props => {
  const { data, pathContext } = props;
  const page = data.markdownRemark.frontmatter;
  Object.assign(page, data.markdownRemark.fields);
  const html = pathContext.html;
  const siteMeta = data.site.siteMetadata;

  return (
    <Page contained={true}>
      <Meta page={page} siteMeta={siteMeta} />
      <PageSection>
        <h1>
          {page.title}
        </h1>
      </PageSection>
      <PageSection dangerouslySetInnerHTML={{ __html: html }}>
      </PageSection>
    </Page>
  );
};

export default GeneralPage;

export const pageQuery = graphql`
query GeneralPageQuery($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
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
