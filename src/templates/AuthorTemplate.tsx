import { graphql } from 'gatsby';
import React from 'react';
import AuthorPage from '../author/AuthorPage';
import { AuthorArticleData, AuthorData } from '../author/types';
import { PageData, SiteMetadata } from '../core/types';

type AuthorTemplateProps = {
  data: {
    author: {
      authors: AuthorData[];
    };
    articles: {
      edges: {
        node: {
          fields: {
            title: string;
            slug: string;
            date: string;
          };
        };
      }[];
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
};

const ArticleTemplate: React.FC<AuthorTemplateProps> = (props: AuthorTemplateProps) => {
  const { data, data: { site: { siteMetadata } } } = props;
  const author = data.author.authors[0];
  const articles = data.articles.edges.map(({ node: { fields } }) => ({
    ...fields,
    groupDate: fields.date,
    url: `${siteMetadata.siteUrl}/${fields.slug}/`,
  } as AuthorArticleData));

  const page: PageData = {
    title: author.name + ' - ' + siteMetadata.title,
    description: siteMetadata.description + '.',
    url: siteMetadata.siteUrl + '/authors/' + author.slug + '/',
  };

  return <AuthorPage page={page} author={author} articles={articles}/>;
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
            date(formatString:"MMMM, YYYY")
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        title
        description
      }
    }
  }
`;
