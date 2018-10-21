import * as React from 'react';
import { graphql } from 'gatsby';

import { Article } from '../components/article';
import { Author } from '../components/author';

interface ArticleTemplateProps {
  data: any;
}

class ArticleTemplate extends React.PureComponent<ArticleTemplateProps, {}> {
  public render() {
    const data = this.props.data;
    const article: Article = {
      ...data.markdownRemark.fields,
      html: data.markdownRemark.html,
      author: data.author.authors[0] as Author,
    };

    return (
      <div>
        <h1>Article</h1>
        <pre>{JSON.stringify(article, null, ' ')}</pre>
      </div>
    );
  }
}

export default ArticleTemplate;

export const pageQuery = graphql`
  query($slug: String!, $author: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      fields {
        title
        slug
        description
        date
        tags {
          name
          slug          
        }
      }
    }
    author: dataYaml(authors: {elemMatch: {slug: {eq: $author}}}) {
      authors {
        name
        slug
        bio
        social {
          twitter
          github
          facebook
        }
      }
    }
  }
`;
