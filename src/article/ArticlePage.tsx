import React from 'react';
import Img from 'gatsby-image';
import { ArticlePageData } from './types';
import Page from '../core/Page';
import ArticleMeta from './ArticleMeta';
import PageSection from '../core/PageSection';
import { createStyles, Theme, Typography } from '@material-ui/core';
import ArticleHeader from './ArticleHeader';
import ArticleFooter from './ArticleFooter';
import { makeStyles } from '@material-ui/core/styles';
import PageContent from '../core/PageContent';
import Newsletter from '../newsletter/Newsletter';
import RelatedArticleList from './RelatedArticleList';

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    marginBottom: '1rem',
  },
  title: {
    marginBottom: '1rem',
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
  const { articlePage, articlePage: { info } } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <ArticleMeta articlePage={articlePage}/>
      <PageSection component="article">
        <Typography variant="h2" variantMapping={{ h2: 'h1' }} className={classes.title}>{info.title}</Typography>
        <ArticleHeader articlePage={articlePage} className={classes.header}/>
        {articlePage.info.cover && <Img fluid={articlePage.info.cover}/>}
        <PageContent html={articlePage.html}/>
      </PageSection>
      <ArticleFooter className={classes.footer} articlePage={articlePage}/>
      <Newsletter className={classes.newsletter}/>
      <RelatedArticleList className={classes.related} articles={articlePage.related}/>
    </Page>
  );
};

export default ArticlePage;
