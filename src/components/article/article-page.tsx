import * as React from 'react';
import Img from 'gatsby-image';

import { Page, PageSection } from '../page';
import Article from './article';
import ArticleHeader from './article-header';

interface ArticlePageProps {
  article: Article;
}

class ArticlePage extends React.PureComponent<ArticlePageProps> {
  public render() {
    const { article } = this.props;

    return (
      <Page narrow>
        <PageSection component="article">
          <h1>{article.title}</h1>
          <Img fluid={article.cover}/>
          <ArticleHeader article={article}/>
          <div dangerouslySetInnerHTML={{ __html: article.html }}/>
        </PageSection>
      </Page>
    );
  }
}

export default ArticlePage;
