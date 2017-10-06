import React from 'react';

import withStyles from './ui/withStyles';
import Grid from './ui/Grid';

const styles = theme => ({
  root: {
    maxWidth: 1024,
    margin: [0, 'auto'],
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: 1280
    }
  },
  narrow: {
    maxWidth: 700,
    [theme.breakpoints.up('xl')]: {
      maxWidth: 900
    },
    padding: [16, 8],
    [theme.breakpoints.up('sm')]: {
      padding: [48, 8]
    }
  }
});

export default withStyles(styles)(({ classes, children, narrow }) => (
  <Grid container spacing={0}
    className={`${classes.root} ${narrow ? classes.narrow : ''}`}>
    {children}
  </Grid>
));
