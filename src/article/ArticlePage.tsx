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
}));

type ArticlePageProps = {
  data: ArticlePageData;
};

const ArticlePage: React.FC<ArticlePageProps> = (props: ArticlePageProps) => {
  const { data, data: { info } } = props;
  const classes = useStyles();

  return (
    <Page narrow>
      <ArticleMeta data={data}/>
      <PageSection component="article">
        <Typography variant="h2" variantMapping={{ h3: 'h1' }} className={classes.title}>{info.title}</Typography>
        <ArticleHeader data={data} className={classes.header}/>
        {data.info.cover && <Img fluid={data.info.cover}/>}
        <PageContent html={data.html}/>
      </PageSection>
      <ArticleFooter className={classes.footer} data={data}/>
      <Newsletter/>
    </Page>
  );
};

export default ArticlePage;
