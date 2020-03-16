import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'gatsby';
import React from 'react';
import ArticleCard from '../article/ArticleCard';
import { ArticleData } from '../article/types';
import BasicPageMeta from '../core/BasicPageMeta';
import Page from '../core/Page';
import { TagPageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing(2),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  paginationLink: {
    ...theme.typography.button,
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

type TagPageProps = {
  tagPage: TagPageData;
  articles: ArticleData[];
};

const TagPage: React.FC<TagPageProps> = (props: TagPageProps) => {
  const {
    tagPage: { title, description, url, page, pageCount, tag },
    articles,
  } = props;
  const classes = useStyles();

  return (
    <Page>
      <BasicPageMeta title={title} description={description} url={url}/>
      <Typography className={classes.title} variant="h1">{tag.title}</Typography>
      <Grid container spacing={2}>
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
        size="large"
        renderItem={(item: { page: number }): React.ReactNode => (
          <PaginationItem
            className={classes.paginationLink}
            component={Link}
            to={item.page === 1 ? `/tags/${tag.slug}` : `tags/${tag.slug}/page/${item.page}`}
            {...item}
          />
        )}
      />
    </Page>
  );
};

export default TagPage;
