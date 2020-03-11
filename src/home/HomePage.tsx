import React from 'react';
import { HomeData } from './types';
import { ArticleInfo } from '../article/types';
import Page from '../core/Page';
import ArticleCard from '../article/ArticleCard';
import HomeMeta from './HomeMeta';
import Pagination from './Pagination';
import { createStyles, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  pagination: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

type HomePageProps = {
  data: HomeData;
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  articles: ArticleInfo[];
};

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { data: { meta }, pageNumber, articlesPerPage, totalArticles, articles } = props;
  const classes = useStyles();

  return (
    <Page>
      <HomeMeta data={meta}/>
      <Grid container>
        {articles.map((article) => (
          <Grid key={article.slug} item xs={12} sm={6}>
            <ArticleCard info={article} key={article.slug}/>
          </Grid>
        ))}
      </Grid>
      <Pagination className={classes.pagination} pageNumber={pageNumber} articlesPerPage={articlesPerPage}
                  totalArticles={totalArticles}/>
    </Page>
  );
};

export default HomePage;
