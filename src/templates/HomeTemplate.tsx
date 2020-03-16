import { graphql } from 'gatsby';
import React from 'react';
import { ArticleData } from '../article/types';
import { AuthorData } from '../author/types';
import { SiteMetadata } from '../core/types';
import HomePage from '../home/HomePage';
import { HomePageData } from '../home/types';

type HomeTemplateProps = {
  pathContext: {
    articlesPerPage: number;
    page: number;
  };
  data: {
    authors: {
      edges: {
        node: {
          authors: AuthorData[];
        };
      }[];
    };
    articles: {
      totalCount: number;
      edges: {
        node: {
          fields: {
            title: string;
            slug: string;
            date: string;
            author: string;
            cover: {
              childImageSharp: {
                fluid: {
                  aspectRatio: number;
                  src: string;
                  srcSet: string;
                  sizes: string;
                };
              };
            };
          };
        };
      }[];
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
};

const HomeTemplate: React.FC<HomeTemplateProps> = (props: HomeTemplateProps) => {
  const { pathContext, data, data: { site: { siteMetadata } } } = props;
  const authors = data.authors.edges[0].node.authors;
  const page = pathContext.page;
  const pageCount = Math.ceil(data.articles.totalCount / pathContext.articlesPerPage);

  const articles = data.articles.edges.map(({ node: { fields } }) => ({
    ...fields,
    cover: fields.cover.childImageSharp.fluid,
    author: authors.find((author) => author.slug === fields.author),
  } as ArticleData));

  const homePage: HomePageData = {
    title: siteMetadata.title + ' - ' + siteMetadata.description,
    description: siteMetadata.description + '.',
    url: siteMetadata.siteUrl + (page === 1 ? '' : `/page/${page}`),
    pageNumber: page,
    articles,
  };

  return <HomePage homePage={homePage} pageCount={pageCount}/>;
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
            avatar
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
            date(formatString:"DD MMMM, YYYY")
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
      }
    }
  }
`;
