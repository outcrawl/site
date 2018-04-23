import React from 'react';

import TagPage from '../components/tag-page';
import { getArticles, getMeta } from '../utils/query';

export default ({
  data,
  pathContext: { tag, page, articlesPerPage, totalArticles },
}) => {
  const meta = getMeta(data);
  const articles = getArticles(data);
  return (
    <TagPage
      meta={meta}
      tag={tag}
      articles={articles}
      page={page}
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
