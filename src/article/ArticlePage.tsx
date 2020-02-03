import React from 'react';
import Img from 'gatsby-image';
import { ArticlePageData } from './types';
import Page from '../core/Page';
import ArticleMeta from './ArticleMeta';
import PageSection from '../core/PageSection';
import { Typography } from '@material-ui/core';
import ArticleHeader from './ArticleHeader';
import ArticleFooter from './ArticleFooter';

type ArticlePageProps = {
  data: ArticlePageData,
};

const ArticlePage: React.FC<ArticlePageProps> = (props: ArticlePageProps) => {
  const { data, data: { info } } = props;

  return (
    <Page narrow>
      <ArticleMeta data={data}/>
      <PageSection component="article">
        <Typography variant="h1">{info.title}</Typography>
        {data.cover && <Img fluid={data.cover}/>}
        <ArticleHeader data={data}/>
        <div dangerouslySetInnerHTML={{ __html: data.html }}/>
      </PageSection>
      <ArticleFooter data={data}/>
    </Page>
  );
};

export default ArticlePage;
