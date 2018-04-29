import React from 'react';

import { getArticle, getMeta } from '../utils/query';
import { ArticlePage } from '../components/article';

export default ({ data }) => {
  const article = getArticle(data);
  return <ArticlePage article={article} />;
};

export const query = graphql`
  query ArticleQuery($slug: String!, $tags: [String]!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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
          name
          slug
          emailHash
        }
        tags {
          slug
          name
        }
      }
    }
    related: allMarkdownRemark(
      filter: {
        fields: { type: { eq: "article" } }
        frontmatter: { tags: { in: $tags } }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
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
