import React from 'react';

import withStyles from './ui/withStyles';
import Grid from './ui/Grid';

const styles = theme => ({
  root: {
    maxWidth: 1024,
    margin: [0, 'auto'],
    padding: 16
  },
  narrow: {
    maxWidth: 700,
    padding: [16, 8]
  }
});

export default withStyles(styles)(({ classes, children, narrow }) => (
  <Grid container spacing={0}
    className={`${classes.root} ${narrow ? classes.narrow : ''}`}>
    {children}
  </Grid>
));
