import React from 'react';
import { withStyles } from 'material-ui';

import markdownStyles from '../../utils/markdown-styles';
import { Page, PageSection } from '../page';
import ArticleHeader from './header';
import ArticleFooter from './footer';
import ArticleRelated from './related';

const styles = (theme) => ({
  article: markdownStyles(theme),
});

const ArticlePage = ({ article, classes }) => {
  return (
    <Page narrow>
      <PageSection component="article" className={classes.article}>
        <h1>{article.title}</h1>
        <ArticleHeader article={article} />
        <img src={article.coverUrl} alt={article.title} />
        <div dangerouslySetInnerHTML={{ __html: article.html }} />
        <ArticleFooter cla article={article} />
      </PageSection>

      <PageSection>
        <ArticleRelated related={article.related} />
      </PageSection>
    </Page>
  );
};

export default withStyles(styles)(ArticlePage);
