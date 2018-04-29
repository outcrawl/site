import React from 'react';

import HomePage from '../components/home-page';
import { getHomePage } from '../utils/query';

export default ({
  data,
  pathContext: { page, articlesPerPage, totalArticles },
}) => {
  const homePage = getHomePage(data);
  return (
    <HomePage
      page={homePage}
      pageNumber={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
    />
  );
};

export const query = graphql`
  query HomePageQuery($skip: Int!, $take: Int!) {
    allMarkdownRemark(
      skip: $skip
      limit: $take
      sort: { fields: [fields___date], order: DESC }
      filter: { fields: { type: { eq: "article" } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            cover {
              childImageSharp {
                original {
                  src
                }
              }
            }
          }
          fields {
            slug
            date(formatString: "DD MMMM, YYYY")
            author {
              name
              slug
              emailHash
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
