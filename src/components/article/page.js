import React from 'react';
import { withStyles } from 'material-ui';

import { Page, PageSection } from '../page';
import ArticleHeader from './header';
import ArticleFooter from './footer';
import ArticleRelated from './related';

const styles = (theme) => ({
  article: {
    '& h1': { ...theme.typography.display4, fontSize: '4rem' },
    '& h2': { ...theme.typography.display3, fontSize: '3rem' },
    '& h3': { ...theme.typography.display2, fontSize: '2.5rem' },
    '& h4': { ...theme.typography.display1, fontSize: '2rem' },
    '& img': {
      maxWidth: '100%',
    },
    '& p': { ...theme.typography.body1 },
  },
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
