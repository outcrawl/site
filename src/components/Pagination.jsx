import React from 'react';
import Link from 'gatsby-link';

import withStyles from './ui/withStyles';
import Grid from './ui/Grid';
import IconButton from './ui/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: [24, 0]
  },
  pageButton: {
    '&:hover': {
      textDecoration: 'none'
    }
  },
  currentPage: {
    color: theme.palette.text.primary
  }
});

export default withStyles(styles)(({ classes, basePath, page, total }) => {
  let prevButton =
    <IconButton
      component={Link}
      to={page === 2 ? basePath : `${basePath}page/${page - 1}/`}
      disabled={page === 1}
      aria-label="Previous page">
      <ChevronLeftIcon />
    </IconButton>;
  let nextButton =
    <IconButton
      component={Link}
      to={`${basePath}page/${page + 1}/`}
      disabled={page === total}
      aria-label="Next page">
      <ChevronRightIcon />
    </IconButton>;

  const pages = [];
  for (let i = 1; i <= total; i++) {
    pages.push(<IconButton
      className={`${classes.pageButton} ${page === i ? classes.currentPage : ''}`}
      component={Link}
      to={i === 1 ? basePath : `${basePath}page/${i}/`}
      key={i}>{i}
    </IconButton>);
  }

  return (
    <Grid item xs={12} className={classes.root}>
      {prevButton}
      {pages}
      {nextButton}
    </Grid>
  );
});
