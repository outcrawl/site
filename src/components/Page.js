import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    maxWidth: 1024,
    margin: '0px auto',
    padding: 16,
  },
  narrow: {
    maxWidth: 700,
    padding: '32px 8px',
  }
});

export default withStyles(styles)(({ classes, children, narrow }) => (
  <Grid container spacing={0}
    className={`${classes.root} ${narrow ? classes.narrow : ''}`}>
    {children}
  </Grid>
));
