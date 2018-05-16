import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from '@material-ui/core/styles';

import { AuthorPlate } from '../author';
import ArticleShare from './share';

const styles = (theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: theme.spacing.unit,
    },
  },
});

const ArticleHeader = ({ article, classes }) => (
  <section className={classes.root}>
    <AuthorPlate author={article.author} subtitle={article.date} />
    <ArticleShare className={classes.share} article={article} />
  </section>
);

export default withStyles(styles)(ArticleHeader);
