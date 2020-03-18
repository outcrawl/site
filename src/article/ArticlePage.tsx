import { Box, createStyles, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Img from 'gatsby-image';
import React from 'react';
import Page from '../core/Page';
import PageContent from '../core/PageContent';
import Newsletter from '../newsletter/Newsletter';
import ArticleFooter from './ArticleFooter';
import ArticleHeader from './ArticleHeader';
import ArticleMeta from './ArticleMeta';
import RelatedArticleList from './RelatedArticleList';
import { ArticlePageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(4),
  },
  newsletter: {
    marginTop: theme.spacing(3),
  },
  related: {
    marginTop: theme.spacing(3),
  },
}));

type ArticlePageProps = {
  articlePage: ArticlePageData;
};

const ArticlePage: React.FC<ArticlePageProps> = (props: ArticlePageProps) => {
  const { articlePage, articlePage: { article } } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <ArticleMeta articlePage={articlePage}/>
      <Box component="article">
        <Typography variant="h1" className={classes.title}>{article.title}</Typography>
        <ArticleHeader articlePage={articlePage} className={classes.header}/>
        {articlePage.article.cover && <Img fluid={articlePage.article.cover}/>}
        <PageContent html={articlePage.html}/>
      </Box>
      <ArticleFooter className={classes.footer} articlePage={articlePage}/>
      <Newsletter className={classes.newsletter}/>
      <RelatedArticleList className={classes.related} articles={articlePage.related}/>
    </Page>
  );
};

export default ArticlePage;
