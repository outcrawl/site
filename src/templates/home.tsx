import * as React from 'react';
import { graphql } from 'gatsby';

import { Article } from '../components/article';
import { Author } from '../components/author';
import { HomePage } from '../components/home';

interface HomeTemplateProps {
  pathContext: {
    articlesPerPage: number;
    page: number;
    skip: number;
    take: number;
  };
  data: {
    authors: any;
    articles: any;
  };
}

class HomeTemplate extends React.PureComponent<HomeTemplateProps, {}> {
  public render() {
    const data = this.props.data;
    const authors: Author[] = data.authors.edges[0].node.authors;
    const totalArticles: number = data.articles.totalCount;

    const articles: Article[] = data.articles.edges.map(({ node: { fields: article } }: any) => ({
      ...article,
      date: new Date(article.date),
      cover: article.cover.publicURL,
      author: authors.find((author) => author.slug === article.author),
    }));

    return <HomePage articles={articles}
                     totalArticles={totalArticles}
                     articlesPerPage={this.props.pathContext.articlesPerPage}/>;
  }
}

export default HomeTemplate;

export const pageQuery = graphql`
  query($skip: Int!, $take: Int!) {
    authors: allDataYaml {
      edges {
        node {
          authors {
            name
            slug
            bio
            social {
              twitter
              github
              facebook
            }
          }
        }
      }
    }
    articles: allMarkdownRemark(
      skip: $skip
      limit: $take
      filter: {fields: {type: {eq: "article"}}}
      sort: {fields: fields___date, order: DESC}
    ) {
      totalCount
      edges {
        node {
          fields {
            title
            slug
            date
            author
            cover {
              publicURL
            }
          }
        }
      }
    }
  }
`;
