import * as React from 'react';
import { graphql } from 'gatsby';

import { Article } from '../components/article';
import { Author } from '../components/author';
import { HomePage } from '../components/home';
import { HomeInfo } from '../components/home/types';

interface HomeTemplateProps {
  pathContext: {
    articlesPerPage: number;
    page: number;
  };
  data: {
    authors: any;
    articles: any;
    site: any;
  };
}

class HomeTemplate extends React.PureComponent<HomeTemplateProps> {
  public render() {
    const data = this.props.data;
    const authors: Author[] = data.authors.edges[0].node.authors;
    const totalArticles: number = data.articles.totalCount;
    const pageNumber: number = this.props.pathContext.page;

    const articles: Article[] = data.articles.edges.map(({ node: { fields: article } }: any) => ({
      ...article,
      date: new Date(article.date),
      cover: article.cover.childImageSharp.fluid,
      author: authors.find((author) => author.slug === article.author),
    }));

    const meta = data.site.siteMetadata;

    const info: HomeInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
      },
      title: `${meta.title} - ${meta.description}`,
      description: `${meta.description}.`,
      url: meta.siteUrl + (pageNumber === 1 ? '' : `/page/${pageNumber}`),
      image: {
        url: `${meta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
    };

    return <HomePage
      info={info}
      pageNumber={pageNumber}
      articlesPerPage={this.props.pathContext.articlesPerPage}
      totalArticles={totalArticles}
      articles={articles}/>;
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
            avatar
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
              childImageSharp {
                fluid(quality: 90) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
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
        twitterId
        facebookId
      }
    }
  }
`;
