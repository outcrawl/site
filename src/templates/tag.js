import React from 'react';

import TagPage from '../components/tag-page';
import { getArticles } from '../utils/query';

export default ({
  data,
  pathContext: { tag, page, articlesPerPage, totalArticles },
}) => {
  const articles = getArticles(data);
  return (
    <TagPage
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
          tableOfContents
          html
          fields {
            slug
            date(formatString: "DD MMMM, YYYY")
            author {
              name
              email
              bio
              social {
                twitter
                github
                facebook
                googlePlus
              }
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
