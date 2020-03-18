import { graphql } from 'gatsby';
import React from 'react';
import ArticlePage from '../article/ArticlePage';
import { ArticleData, ArticlePageData } from '../article/types';
import { AuthorData } from '../author/types';
import { shuffle } from '../common/arrays';
import { SiteMetadata } from '../core/types';
import { TagData } from '../tag/types';

type ArticleTemplateProps = {
  data: {
    article: {
      html: string;
      fields: {
        title: string;
        slug: string;
        description: string;
        date: string;
        tags: {
          title: string;
          slug: string;
        }[];
        cover?: {
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
    author: {
      authors: AuthorData[];
    };
    related: {
      edges: {
        node: {
          fields: {
            title: string;
            slug: string;
          };
        };
      }[];
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
};

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ data }: ArticleTemplateProps) => {
  const siteMetadata = data.site.siteMetadata;
  const article = {
    ...data.article.fields,
    html: data.article.html,
  };

  const author = data.author?.authors.length > 0 ? data.author.authors[0] : undefined;

  const relatedArticles: ArticleData[] = data.related.edges
    .map(({ node: { fields: article } }) => ({
      title: article.title,
      slug: article.slug,
      url: `${siteMetadata.siteUrl}/${article.slug}`,
    } as ArticleData));

  const related = shuffle(relatedArticles)
    .filter((value: ArticleData) => value.slug !== data.article.fields.slug)
    .slice(0, 3);

  const articlePageData: ArticlePageData = {
    article: {
      title: article.title,
      slug: article.slug,
      url: `${siteMetadata.siteUrl}/${article.slug}`,
      author,
      date: article.date,
      cover: article.cover && {
        ...article.cover.childImageSharp.fluid,
        url: siteMetadata.siteUrl + article.cover.publicURL,
        width: article.cover.childImageSharp.original.width,
        height: article.cover.childImageSharp.original.height,
      },
    },
    description: article.description,
    html: article.html,
    tags: article.tags as TagData[],
    related,
  };

  return <ArticlePage articlePage={articlePageData}/>;
};

export default ArticleTemplate;

export const pageQuery = graphql`
  query($slug: String!, $author: String, $tags: [String]!) {
    article: markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      fields {
        title
        slug
        description
        date(formatString:"DD MMMM, YYYY")
        tags {
          title
          slug
        }
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
    author: dataYaml(authors: {elemMatch: {slug: {eq: $author}}}) {
      authors {
        name
        slug
        bio
        avatar
        social {
          github
          linkedin
          twitter
          facebook
        }
      }
    }
    related: allMarkdownRemark(
      filter: {
        fields: {
          type: { eq: "article" },
          tags: { elemMatch: { slug: { in: $tags}}}
        }
      }
    ) {
      edges {
        node {
          fields {
            title
            slug
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
