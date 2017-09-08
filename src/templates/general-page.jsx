import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import PageSection from '../components/PageSection';

const GeneralPage = ({ data, pathContext }) => {
  const page = data.markdownRemark.frontmatter;
  const html = pathContext.html;

  return (
    <Page contained={true}>
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

export const generalPageQuery = graphql`
  query GeneralPageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
    }
  }
`;
