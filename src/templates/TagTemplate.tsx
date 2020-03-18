import { graphql } from 'gatsby';
import React from 'react';
import { ArticleData } from '../article/types';
import { AuthorData } from '../author/types';
import { SiteMetadata } from '../core/types';
import TagPage from '../tag/TagPage';
import { TagData, TagPageData } from '../tag/types';

type TagTemplateProps = {
  pathContext: {
    page: number;
    articlesPerPage: number;
    tag: TagData;
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
              publicURL: string;
              childImageSharp: {
                original: {
                  width: number;
                  height: number;
                };
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
}

const TagTemplate: React.FC<TagTemplateProps> = (props: TagTemplateProps) => {
  const {
    pathContext: { page, articlesPerPage, tag },
    data, data: { site: { siteMetadata } },
  } = props;
  const authors = data.authors.edges[0].node.authors;
  const pageCount = Math.ceil(data.articles.totalCount / articlesPerPage);

  const articles = data.articles.edges.map(({ node: { fields } }) => ({
    ...fields,
    cover: fields.cover && {
      ...fields.cover.childImageSharp.fluid,
      url: fields.cover.publicURL,
      width: fields.cover.childImageSharp.original.width,
      height: fields.cover.childImageSharp.original.height,
    },
    author: authors.find((author) => author.slug === fields.author),
  } as ArticleData));

  const tagPage: TagPageData = {
    title: tag.title + ' - ' + siteMetadata.title,
    description: siteMetadata.description + '.',
    url: siteMetadata.siteUrl + '/tags/' + tag.slug + (page === 1 ? '' : `/page/${page}`),
    tag,
    pageNumber: page,
    pageCount,
  };

  return <TagPage tagPage={tagPage} articles={articles}/>;
};

export default TagTemplate;


export const pageQuery = graphql`
  query($tagSlug: String!, $skip: Int!, $take: Int!) {
    articles: allMarkdownRemark(
      skip: $skip
      limit: $take
      sort: { fields: [fields___date], order: DESC }
      filter: {fields: {type: {eq: "article"}, tags: {elemMatch: {slug: {eq: $tagSlug}}}}}
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
              publicURL
              childImageSharp {
                original {
                  width
                  height
                }
                fluid(quality: 90) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
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
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;

