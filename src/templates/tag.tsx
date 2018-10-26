import * as React from 'react';
import { graphql } from 'gatsby';
import { TagPage } from '../components/tag';
import { Author } from '../components/author';
import { Article } from '../components/article';
import { Tag } from '../components/tag';

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

    const authors: Author[] = data.authors.edges[0].node.authors;
    const totalArticles: number = data.articles.totalCount;
    const articlesPerPage = data.site.siteMetadata.articlesPerPage;

    const articles: Article[] = data.articles.edges.map(({ node: { fields: article } }: any) => ({
      ...article,
      date: new Date(article.date),
      cover: article.cover.childImageSharp.fluid,
      author: authors.find((author) => author.slug === article.author),
    }));

    return <TagPage
      tag={tag}
      articles={articles}
      articlesPerPage={articlesPerPage}
      page={page}
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
      }
    }
  }
`;
