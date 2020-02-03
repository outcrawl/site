import React from 'react';
import { graphql } from 'gatsby';
import { ArticleInfo, ArticlePageData } from '../article/types';
import { AuthorData } from '../author/types';
import ArticlePage from '../article/ArticlePage';
import { TagData } from '../tag/types';
import { shuffle } from '../common/arrays';

type ArticleTemplateProps = {
  data: any;
};

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ data }: ArticleTemplateProps) => {
  const siteMeta = data.site.siteMetadata;

  const article = {
    ...data.article.fields,
    html: data.article.html,
  };

  const author = data.author.authors.length > 0 ? data.author.authors[0] as AuthorData : undefined;

  const relatedArticles: ArticleInfo[] = data.related.edges
    .map(({ node: { fields: article } }: { node: { fields: ArticleInfo } }) => ({
      title: article.title,
      slug: article.slug,
      url: `${siteMeta.siteUrl}/${article.slug}`,
    } as ArticleInfo));
  const related: ArticleInfo[] = shuffle(relatedArticles)
    .filter((value: ArticleInfo) => value.slug !== data.article.fields.slug)
    .slice(0, 3);

  const articlePageData: ArticlePageData = {
    info: {
      title: article.title,
      slug: article.slug,
      url: `${siteMeta.siteUrl}/${article.slug}`,
      author,
      date: article.date,
    },
    meta: {
      site: {
        title: siteMeta.title,
        url: siteMeta.siteUrl,
        description: siteMeta.description,
        twitterId: siteMeta.twitterId,
        facebookId: siteMeta.facebookId,
      },
      url: `${siteMeta.siteUrl}/${article.slug}`,
      title: `${siteMeta.title} - ${siteMeta.description}`,
      description: siteMeta.description,
      image: {
        url: article.cover.publicURL,
        width: 1280,
        height: 720,
      },
    },
    description: article.description,
    cover: {
      ...article.cover.childImageSharp.fluid,
      url: article.cover.publicURL,
      width: 1280,
      height: 720,
    },
    html: article.html,
    tags: article.tags as TagData[],
    related,
  };

  return <ArticlePage data={articlePageData}/>;
};

export default ArticleTemplate;

export const pageQuery = graphql`
  query($slug: String!, $author: String!, $tags: [String]!) {
    article: markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      fields {
        title
        slug
        description
        date
        tags {
          title
          slug
        }
        cover {
          publicURL
          childImageSharp {
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
        title
        description
        siteUrl
        twitterId
        facebookId
      }
    }
  }
`;
