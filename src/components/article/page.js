import React from 'react';

import { Page, PageSection } from '../page';
import { ArticleMeta } from '../meta';
import ArticleHeader from './header';
import ArticleFooter from './footer';
import ArticleRelated from './related';
import Newsletter from './newsletter';

const ArticlePage = ({ article }) => {
  return (
    <Page narrow>
      <ArticleMeta article={article} />

      <PageSection component="article">
        <h1>{article.title}</h1>
        <ArticleHeader article={article} />
        <span dangerouslySetInnerHTML={{ __html: article.html }} />
      </PageSection>

      <ArticleFooter cla article={article} />

      <Newsletter />

      <ArticleRelated related={article.related} />
    </Page>
  );
};

export default ArticlePage;