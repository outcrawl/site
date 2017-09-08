import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    maxWidth: 1024,
    margin: [0, 'auto', 0, 'auto'],
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit
    }
  },
  containedPage: {
    maxWidth: 700
  }
});

const Page = props => {
  const classes = props.classes;
  return (
    <Grid
      className={`${classes.root} ${props.contained ? classes.containedPage : ''}`}
      container
      spacing={0}>
      {props.children}
    </Grid>
  );
};

export default withStyles(styles)(Page);
