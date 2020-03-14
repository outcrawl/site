import React from 'react';
import { graphql } from 'gatsby';
import AuthorPage from '../author/AuthorPage';
import { AuthorArticleData, AuthorData } from '../author/types';

type AuthorTemplateProps = {
  data: any;
};

const ArticleTemplate: React.FC<AuthorTemplateProps> = (props: AuthorTemplateProps) => {
  const { data } = props;
  const siteMetadata = data.site.siteMetadata;
  const author: AuthorData = data.author;
  const articles: AuthorArticleData[] = data.articles.edges.map(({ node: { fields } }: any) => ({
    ...fields,
    url: `${siteMetadata.siteUrl}/${fields.slug}`,
  }));

  return <AuthorPage author={author} articles={articles}/>;
};

export default ArticleTemplate;

export const pageQuery = graphql`
  query($author: String!) {
    author: dataYaml(authors: {elemMatch: {slug: {eq: $author}}}) {
      authors {
        name
        slug
        bio
        avatar
        email
        social {
          github
          linkedin
          twitter
          facebook
        }
      }
    }
    articles: allMarkdownRemark(
      filter: {fields: {author: {eq: $author}}},
      sort: {fields:fields___date, order: DESC}
    ) {
      edges {
        node {
          fields {
            title
            slug
            date
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
