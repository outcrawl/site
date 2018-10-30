import * as React from 'react';
import { graphql } from 'gatsby';

import { Article, ArticleInfo, ArticlePage } from '../components/article';
import { Author } from '../components/author';
import { shuffle } from '../utils/helpers';
import withRoot from '../components/with-root';

interface ArticleTemplateProps {
  data: {
    article: any;
    author: any;
    related: any;
    site: any;
  };
}

class ArticleTemplate extends React.PureComponent<ArticleTemplateProps> {
  public render() {
    const data = this.props.data;
    const meta = data.site.siteMetadata;

    const related = shuffle(data.related.edges
      .map(({ node: { fields: a } }: any) => ({
        title: a.title,
        slug: a.slug,
        url: `${meta.siteUrl}/${a.slug}`,
      })))
      .filter((a: any) => a.slug !== data.article.fields.slug)
      .slice(0, 3);

    const article: Article = {
      ...data.article.fields,
      html: data.article.html,
      author: data.author.authors[0] as Author,
      cover: data.article.fields.cover.childImageSharp.fluid,
      url: `${meta.siteUrl}/${data.article.fields.slug}`,
      related,
    };

    const info: ArticleInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
        url: meta.siteUrl,
      },
      image: {
        url: data.article.fields.cover.publicURL,
        width: 1280,
        height: 1280,
      },
    };

    return <ArticlePage info={info} article={article}/>;
  }
}

export default withRoot(ArticleTemplate);

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
