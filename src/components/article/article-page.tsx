import * as React from 'react';
import Img from 'gatsby-image';

import { Page, PageSection } from '../page';
import Article from './article';
import ArticleHeader from './article-header';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import ArticleFooter from './article-footer';
import RelatedArticles from './related-articles';

const styles = (theme: Theme) => createStyles({
  header: {
    marginBottom: '1rem',
  },
});

interface ArticlePageProps {
  article: Article;
  classes?: {
    header: string;
  };
}

class ArticlePage extends React.PureComponent<ArticlePageProps> {
  public render() {
    const { article, classes } = this.props;

    return (
      <Page narrow>
        <PageSection component="article">
          <h1>{article.title}</h1>
          <ArticleHeader article={article} className={classes.header}/>
          <Img fluid={article.cover}/>
          <div dangerouslySetInnerHTML={{ __html: article.html }}/>
        </PageSection>

        <ArticleFooter article={article}/>

        <RelatedArticles related={article.related}/>
      </Page>
    );
  }
}

export default withStyles(styles)(ArticlePage);
