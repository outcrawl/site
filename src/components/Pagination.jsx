import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: [24, 0]
  },
  currentPage: {
    color: theme.palette.text.primary
  }
});

const Pagination = props => {
  const classes = props.classes;
  const basePath = props.basePath;

  let prevButton =
    <IconButton
      component={Link}
      to={props.page === 2 ? basePath : `${basePath}page/${props.page - 1}`}
      disabled={props.page === 1}
      aria-label="Previous page">
      <ChevronLeftIcon />
    </IconButton>;
  let nextButton =
    <IconButton
      component={Link}
      to={`${basePath}page/${props.page + 1}`}
      disabled={props.page === props.total}
      aria-label="Next page">
      <ChevronRightIcon />
    </IconButton>;

  const pages = [];
  for (let i = 1; i <= props.total; i++) {
    pages.push(<IconButton
      className={props.page === i ? classes.currentPage : ''}
      component={Link}
      to={i === 1 ? basePath : `${basePath}page/${i}`}
      key={i}>{i}
    </IconButton>);
  }

  return (
    <Grid className={classes.root} item xs={12}>
      {prevButton}
      {pages}
      {nextButton}
    </Grid>
  );
};

export default withStyles(styles)(Pagination);
