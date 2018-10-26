import * as React from 'react';
import { graphql } from 'gatsby';

import { Author, AuthorPage } from '../components/author';
import { Article } from '../components/article';

interface AuthorTemplateProps {
  data: {
    author: any;
    articles: any;
  };
}

class AuthorTemplate extends React.PureComponent<AuthorTemplateProps> {
  public render() {
    const data = this.props.data;
    const author: Author = data.author.authors[0];
    const articles: Article[] = data.articles.edges
      .map(({ node: { fields: article } }: any) => ({
        ...article,
        date: new Date(article.date),
      }));

    return <AuthorPage author={author} articles={articles}/>;
  }
}

export default AuthorTemplate;

export const pageQuery = graphql`
  query($author: String!) {
    author: dataYaml(authors: {elemMatch: {slug: {eq: $author}}}) {
      authors {
        name
        slug
        bio
        avatar
        social {
          twitter
          github
          facebook
        }
      }
    }
    articles: allMarkdownRemark(
      filter: {fields: {author: {eq: $author}}},
      sort: {fields:fields___date, order: DESC}
    ) {
      edges {
        node {
          fields {
            title
            slug
            date
            tags {
              slug
              title
            }
          }
        }
      }
    }
  }
`;
