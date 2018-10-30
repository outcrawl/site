import * as React from 'react';
import Img from 'gatsby-image';

import { Page, PageSection } from '../page';
import { Article, ArticleInfo } from './types';
import ArticleHeader from './article-header';
import { createStyles, withStyles } from '@material-ui/core';
import ArticleFooter from './article-footer';
import RelatedArticles from './related-articles';
import Newsletter from '../newsletter/newsletter';
import ArticleMeta from './article-meta';

const styles = () => createStyles({
  header: {
    marginBottom: '1rem',
  },
  title: {
    marginTop: '1rem',
    marginBottom: '1.5rem',
  },
});

interface ArticlePageProps {
  info: ArticleInfo;
  article: Article;
  classes?: {
    header: string;
    title: string;
  };
}

class ArticlePage extends React.PureComponent<ArticlePageProps> {
  public render() {
    const { info, article, classes } = this.props;

    return (
      <Page narrow>
        <ArticleMeta info={info} article={article}/>

        <PageSection component="article">
          <h1 className={classes.title}>{article.title}</h1>
          <ArticleHeader article={article} className={classes.header}/>
          <Img fluid={article.cover}/>
          <div dangerouslySetInnerHTML={{ __html: article.html }}/>
        </PageSection>

        <ArticleFooter article={article}/>

        <Newsletter/>

        <RelatedArticles related={article.related}/>
      </Page>
    );
  }
}

export default withStyles(styles)(ArticlePage);
