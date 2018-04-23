import React from 'react';
import { withStyles } from 'material-ui';

import { Page, PageSection } from '../page';
import ArticleHeader from './header';
import ArticleFooter from './footer';
import ArticleRelated from './related';

const ArticlePage = ({ article }) => {
  return (
    <Page narrow>
      <PageSection component="article">
        <h1>{article.title}</h1>
        <ArticleHeader article={article} />
        <span dangerouslySetInnerHTML={{ __html: article.html }} />
      </PageSection>

      <ArticleFooter cla article={article} />

      <ArticleRelated related={article.related} />
    </Page>
  );
};

export default ArticlePage;
