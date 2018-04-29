import React from 'react';

import { AuthorPage } from '../components/author';
import { getAuthorPage } from '../utils/query';

export default ({ data, pathContext: { author } }) => {
  const authorPage = getAuthorPage(data);
  authorPage.author = author;
  return <AuthorPage authorPage={authorPage} />;
};

export const query = graphql`
  query AuthorPageQuery($authorSlug: String!) {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      filter: { fields: { author: { slug: { eq: $authorSlug } } } }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
            date
            tags {
              slug
              name
            }
          }
        }
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
