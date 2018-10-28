import * as React from 'react';
import { graphql } from 'gatsby';
import { TagPage } from '../components/tag';
import { Author } from '../components/author';
import { Article } from '../components/article';
import { Tag } from '../components/tag';
import { TagInfo } from '../components/tag/types';

interface TagTemplateProps {
  pathContext: {
    page: number;
    tag: Tag;
  };
  data: {
    articles: any;
    authors: any;
    site: any;
  };
}

class TagTemplate extends React.PureComponent<TagTemplateProps> {
  public render() {
    const {
      pathContext: { page, tag },
    } = this.props;
    const data = this.props.data;
    const meta = data.site.siteMetadata;

    const authors: Author[] = data.authors.edges[0].node.authors;
    const totalArticles: number = data.articles.totalCount;
    const articlesPerPage = meta.articlesPerPage;

    const articles: Article[] = data.articles.edges.map(({ node: { fields: article } }: any) => ({
      ...article,
      date: new Date(article.date),
      cover: article.cover.childImageSharp.fluid,
      author: authors.find((author) => author.slug === article.author),
    }));

    const info: TagInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
      },
      title: `${tag.title} - ${meta.title}`,
      description: `Articles about ${tag.title} on ${meta.title}.`,
      url: `${meta.siteUrl}/tags/${tag.slug}` + (page === 1 ? '' : `/page/${page}`),
      image: {
        url: `${meta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
    };

    return <TagPage
      info={info}
      tag={tag}
      articles={articles}
      articlesPerPage={articlesPerPage}
      pageNumber={page}
      totalArticles={totalArticles}/>;
  }
}

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
            description
            slug
            date
            author
            tags {
              slug
              title
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
      }
    }
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
    site {
      siteMetadata {
        title
        description
        articlesPerPage
        siteUrl
        twitterId
        facebookId
      }
    }
  }
`;
