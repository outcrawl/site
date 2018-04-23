import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';

import AuthorSubtitle from '../author-subtitle';
import ArticleShare from './share';

const styles = (theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
});

const ArticleHeader = ({ article, classes }) => (
  <section className={classes.root}>
    <AuthorSubtitle author={article.author} subtitle={article.date} />
    <ArticleShare className={classes.share} article={article} />
  </section>
);

export default withStyles(styles)(ArticleHeader);
