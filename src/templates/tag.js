import React from 'react';

import TagPage from '../components/tag-page';
import { getTagPage } from '../utils/query';

export default ({
  data,
  pathContext: { tag, page, articlesPerPage, totalArticles },
}) => {
  const tagPage = getTagPage(data);
  tagPage.tag = tag;
  return (
    <TagPage
      page={tagPage}
      pageNumber={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
    />
  );
};

export const query = graphql`
  query TagPageQuery($tagName: String!, $skip: Int!, $take: Int!) {
    allMarkdownRemark(
      skip: $skip
      limit: $take
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { tags: { eq: $tagName } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
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
              slug
              name
              email
              emailHash
            }
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
