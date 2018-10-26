import * as React from 'react';
import { graphql } from 'gatsby';

import { Article, ArticlePage } from '../components/article';
import { Author } from '../components/author';
import { shuffle } from '../utils/helpers';

interface ArticleTemplateProps {
  data: {
    site: any;
    article: any;
    author: any;
    related: any;
  };
}

class ArticleTemplate extends React.PureComponent<ArticleTemplateProps> {
  public render() {
    const data = this.props.data;

    const related = shuffle(data.related.edges
      .map(({ node: { fields: a } }: any) => ({
        title: a.title,
        slug: a.slug,
        url: `${data.site.siteMetadata.siteUrl}/${a.slug}`,
      })))
      .filter((a: any) => a.slug !== data.article.fields.slug)
      .slice(0, 3);

    const article: Article = {
      ...data.article.fields,
      html: data.article.html,
      author: data.author.authors[0] as Author,
      cover: data.article.fields.cover.childImageSharp.fluid,
      url: `${data.site.siteMetadata.siteUrl}/${data.article.fields.slug}`,
      related,
    };

    return <ArticlePage article={article}/>;
  }
}

export default ArticleTemplate;

export const pageQuery = graphql`
  query($slug: String!, $author: String!, $tags: [String]!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
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
          twitter
          github
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
  }
`;
