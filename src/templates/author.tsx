import * as React from 'react';
import { graphql } from 'gatsby';

import { Author, AuthorInfo, AuthorPage } from '../components/author';
import { Article } from '../components/article';
import withRoot from '../components/with-root';

interface AuthorTemplateProps {
  data: {
    author: any;
    articles: any;
    site: any;
  };
}

class AuthorTemplate extends React.PureComponent<AuthorTemplateProps> {
  public render() {
    const data = this.props.data;
    const meta = data.site.siteMetadata;

    const author: Author = data.author.authors[0];
    const articles: Article[] = data.articles.edges
      .map(({ node: { fields: article } }: any) => ({
        ...article,
        date: new Date(article.date),
      }));

    const info: AuthorInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
        url: meta.siteUrl,
      },
      image: {
        url: `${meta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
    };

    return <AuthorPage info={info} author={author} articles={articles}/>;
  }
}

export default withRoot(AuthorTemplate);

export const pageQuery = graphql`
  query($author: String!) {
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
            tags {
              slug
              title
            }
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
