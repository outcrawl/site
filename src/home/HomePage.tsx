import React from 'react';
import { ArticleData } from '../article/types';
import Page from '../core/Page';
import ArticleCard from '../article/ArticleCard';
import HomeMeta from './HomeMeta';
import { createStyles, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'gatsby';

const useStyles = makeStyles((theme: Theme) => createStyles({
  pagination: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

type HomePageProps = {
  page: number;
  pageCount: number;
  articles: ArticleData[];
};

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { page, pageCount, articles } = props;
  const classes = useStyles();

  return (
    <Page>
      <HomeMeta/>
      <Grid container>
        {articles.map((article) => (
          <Grid key={article.slug} item xs={12} sm={6}>
            <ArticleCard article={article} key={article.slug}/>
          </Grid>
        ))}
      </Grid>

      <Pagination
        className={classes.pagination}
        page={page}
        count={pageCount}
        color="primary"
        renderItem={(item: { page: number }): React.ReactNode => (
          <PaginationItem
            component={Link}
            to={item.page === 1 ? '/' : `/page/${item.page}`}
            page={item.page}
            color="primary"
          />
        )}
      />
    </Page>
  );
};

export default HomePage;
