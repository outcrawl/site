import React from 'react';
import Helmet from 'react-helmet';
import { withStyles } from 'material-ui';

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

      <ArticleRelated related={article.related} />

      <Newsletter />
    </Page>
  );
};

export default ArticlePage;
