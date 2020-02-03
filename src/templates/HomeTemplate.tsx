import React from 'react';
import { graphql } from 'gatsby';
import { ArticleInfo } from '../article/types';
import { AuthorData } from '../author/types';
import { HomeData } from '../home/types';
import HomePage from '../home/HomePage';

type HomeTemplateProps = {
  pathContext: {
    articlesPerPage: number;
    page: number;
  };
  data: any;
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({ pathContext, data }: HomeTemplateProps) => {
  const authors: AuthorData[] = data.authors.edges[0].node.authors;
  const totalArticles: number = data.articles.totalCount;
  const pageNumber = pathContext.page;

  const articles: ArticleInfo[] = data.articles.edges.map(({ node: { fields: article } }: any) => ({
    ...article,
    date: new Date(article.date),
    cover: article.cover.childImageSharp.fluid,
    author: authors.find((author) => author.slug === article.author),
  }));

  const siteMeta = data.site.siteMetadata;

  const homePageData: HomeData = {
    meta: {
      site: {
        title: siteMeta.title,
        url: siteMeta.siteUrl,
        description: siteMeta.description,
        twitterId: siteMeta.twitterId,
        facebookId: siteMeta.facebookId,
      },
      url: siteMeta.siteUrl + (pageNumber === 1 ? '' : `/page/${pageNumber}`),
      title: `${siteMeta.title} - ${siteMeta.description}`,
      description: siteMeta.description,
      image: {
        url: `${siteMeta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
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
                fluid(quality: 90) {
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
        title
        siteUrl
        description
        twitterId
        facebookId
        siteUrl
      }
    }
  }
`;
