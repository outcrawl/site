import React from 'react';
import { graphql } from 'gatsby';
import { ArticleData } from '../article/types';
import { AuthorData } from '../author/types';
import HomePage from '../home/HomePage';

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
  };
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({ pathContext, data }: HomeTemplateProps) => {
  const authors = data.authors.edges[0].node.authors;
  const page = pathContext.page;
  const pageCount = Math.ceil(data.articles.totalCount / pathContext.articlesPerPage);

  const articles = data.articles.edges.map(({ node: { fields } }) => ({
    ...fields,
    cover: fields.cover.childImageSharp.fluid,
    author: authors.find((author) => author.slug === fields.author),
  } as ArticleData));

  return (
    <HomePage
      page={page}
      pageCount={pageCount}
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
  }
`;
