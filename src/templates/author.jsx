import React from 'react';
import Link from 'gatsby-link';

import Page from '../components/Page';
import PageSection from '../components/PageSection';

const AuthorPage = props => {
  const { data, pathContext } = props;
  return (
    <Page contained={true}>
      <PageSection>
      </PageSection>
    </Page>
  );
};

export default AuthorPage;

export const pageQuery = graphql`
  query AuthorPageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
    }
  }
`;
