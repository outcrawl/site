import React from 'react';
import moment from 'moment';

import AuthorPage from '../components/author-page';
import { getArticles } from '../utils/query';

export default ({ data, pathContext: { author } }) => {
  const articles = getArticles(data);
  // Group articles by month
  author.articlesByMonth = articles.reduce((g, a) => {
    const key = moment(a.date).format('MMMM YYYY');
    (g[key] = g[key] || []).push(a);
    return g;
  }, {});

  return (
    <AuthorPage
      author={author}
      articles={articles}
    />
  );
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
            date(formatString: "DD MMMM, YYYY")
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
