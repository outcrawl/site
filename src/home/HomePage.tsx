import { createStyles, Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'gatsby';
import React from 'react';
import ArticleCard from '../article/ArticleCard';
import ArticleCardGrid from '../article/ArticleCardGrid';
import BasicPageMeta from '../core/BasicPageMeta';
import Page from '../core/Page';
import { HomePageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
  },
  paginationLink: {
    ...theme.typography.button,
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

type HomePageProps = {
  homePage: HomePageData;
  pageCount: number;
};

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { homePage, pageCount } = props;
  const classes = useStyles();

  return (
    <Page>
      <BasicPageMeta {...homePage}/>
      <ArticleCardGrid articles={homePage.articles}/>
      <Pagination
        className={classes.pagination}
        page={homePage.pageNumber}
        count={pageCount}
        color="primary"
        size="medium"
        renderItem={(item: { page: number }): React.ReactNode => (
          <PaginationItem
            className={classes.paginationLink}
            component={Link}
            to={item.page === 1 ? '/' : `/page/${item.page}`}
            {...item}
          />
        )}
      />
    </Page>
  );
};

export default HomePage;
