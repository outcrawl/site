import React from 'react';
import { graphql } from 'gatsby';
import { ArticleData } from '../article/types';
import { AuthorData } from '../author/types';
import { HomePageData } from '../home/types';
import HomePage from '../home/HomePage';

type HomeTemplateProps = {
  pathContext: {
    articlesPerPage: number;
    page: number;
  };
  data: any;
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({pathContext, data}: HomeTemplateProps) => {
  const authors: AuthorData[] = data.authors.edges[0].node.authors;
  const totalArticles: number = data.articles.totalCount;
  const pageNumber = pathContext.page;

  const articles: ArticleData[] = data.articles.edges.map(({node: {fields: article}}: any) => ({
    ...article,
    date: new Date(article.date),
    cover: article.cover.childImageSharp.fluid,
    author: authors.find((author) => author.slug === article.author),
  }));

  const meta = data.site.siteMetadata;

  const homePageData: HomePageData = {
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

  return (
    <HomePage
      data={homePageData}
      pageNumber={pageNumber}
      articlesPerPage={pathContext.articlesPerPage}
      totalArticles={totalArticles}
      articles={articles}
    />
  );
};

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
                fluid {
                  aspectRatio
                  src
                  srcSet
                  sizes
                  originalImg
                }
              }
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;
