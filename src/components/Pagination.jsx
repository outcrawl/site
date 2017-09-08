import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

const ChevronLeftIcon = props => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
  </svg>
);
const ChevronRightIcon = props => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
  </svg>
);

const styles = theme => ({
  root: {
    textAlign: 'center',
    padding: [24, 0]
  },
  icon: {
    width: 24,
    height: 24
  },
  button: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '24px',
    verticalAlign: 'middle'
  },
  currentPage: {
    color: theme.palette.text.primary
  }
});

const Pagination = props => {
  const classes = props.classes;

  let prevButton =
    <IconButton
      className={classes.button}
      component={Link}
      to={props.page === 2 ? '/' : `/page/${props.page - 1}`}
      disabled={props.page === 1}
      aria-label="Previous page">
      <ChevronLeftIcon className={classes.icon} />
    </IconButton>;
  let nextButton =
    <IconButton
      className={classes.button}
      component={Link}
      to={`/page/${props.page + 1}`}
      disabled={props.page === props.total}
      aria-label="Next page">
      <ChevronRightIcon className={classes.icon} />
    </IconButton>;

  const pages = [];
  for (let i = 1; i <= props.total; i++) {
    pages.push(<IconButton
      className={`${classes.button} ${props.page === i ? classes.currentPage : ''}`}
      component={Link}
      to={i === 1 ? '/' : `/page/${i}`}
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
