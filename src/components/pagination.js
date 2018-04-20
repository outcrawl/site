import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import _ from '../utils/helpers';
import { ChevronLeft, ChevronRight } from './icons';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    padding: [[theme.spacing.unit * 3, 0]],
  },
});

const Pagination = ({
  classes,
  page,
  articlesPerPage,
  totalArticles,
  basePath,
}) => {
  const pageCount = Math.ceil(totalArticles / articlesPerPage);
  basePath = basePath || '';

  return (
    <Grid item xs={12} className={classes.root} component="section">
      {/* Previous button */}
      <IconButton
        disabled={page == 1}
        component={page == 1 ? 'span' : Link}
        to={page == 2 ? basePath || '/' : `${basePath}/page/${page - 1}`}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </IconButton>

      {/* Page number buttons */}
      {_.forRange(1, pageCount + 1, (i) => (
        <IconButton
          key={i}
          disabled={page == i}
          component={page == i ? 'span' : Link}
          to={i == 1 ? basePath || '/' : `${basePath}/page/${i}`}
          aria-label="Previous page"
        >
          <Typography variant="button">{i}</Typography>
        </IconButton>
      ))}

      {/* Next button */}
      <IconButton
        disabled={page == pageCount}
        component={page == pageCount ? 'span' : Link}
        to={`${basePath}/page/${page + 1}`}
        aria-label="Next page"
      >
        <ChevronRight />
      </IconButton>
    </Grid>
  );
};

export default withStyles(styles)(Pagination);
