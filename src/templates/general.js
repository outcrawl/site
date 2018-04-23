import React from 'react';

import { getGeneralPage } from '../utils/query';
import GeneralPage from '../components/general-page';

export default ({ data }) => {
  const page = getGeneralPage(data);
  return <GeneralPage page={page} />;
};

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
      }
    }
  }
`;
