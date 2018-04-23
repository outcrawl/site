import React from 'react';
import { withStyles } from 'material-ui';

import markdownStyles from '../../utils/markdown-styles';
import { Page, PageSection } from '../page';
import ArticleHeader from './header';
import ArticleFooter from './footer';
import ArticleRelated from './related';

const styles = (theme) => ({
  markdown: markdownStyles(theme),
});

const ArticlePage = ({ article, classes }) => {
  return (
    <Page narrow>
      <PageSection component="article">
        <span className={classes.markdown}>
          <h1>{article.title}</h1>
        </span>
        <ArticleHeader article={article} />
        <span
          className={classes.markdown}
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </PageSection>

      <ArticleFooter cla article={article} />

      <ArticleRelated related={article.related} />
    </Page>
  );
};

export default withStyles(styles)(ArticlePage);
